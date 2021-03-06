import * as functions from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

import * as admin from 'firebase-admin';
admin.initializeApp();

import { DocumentData } from '@google-cloud/firestore';

type Body = {
    bodyArray: string[],
    uid: string,
}

const isBody = (item: any): item is Body => {
    return !!item.bodyArray
}

type Credential = {
    accessToken: string,
    secret: string
}

const isCredential = (item: any): item is Credential => {
    return item.accessToken && item.secret
}

exports.post = functions.firestore
    .document('posts/{postId}')
    .onCreate(async (snapshot: DocumentSnapshot, context: functions.EventContext) => {
        const doc: DocumentData | undefined = snapshot.data()

        if (!isBody(doc)) {
            console.log('body is not type of Body')
            return
        }

        const { bodyArray, uid } = doc
        const { postId } = context.params

        const db = admin.firestore();
        const credentialResponse: DocumentSnapshot = await db.doc(`/users/${uid}`).get()
        const credential = credentialResponse.data()

        if (!credential || !isCredential(credential)) {
            console.log('credential is not type of Credential')
            return
        }

        const Twitter = require('twitter');
        const client = new Twitter({
            consumer_key: functions.config().twitter.consumer_key,
            consumer_secret: functions.config().twitter.consumer_secret,
            access_token_key: credential.accessToken,
            access_token_secret: credential.secret
        });

        let id: string | null = null
        let screenName: string | null = null

        let isSavedTweetId = false

        for (let body of bodyArray) {
            const requestBody: any = {}
            if (screenName !== null) {
                body = `@${screenName} ${body}`
            }
            requestBody.status = body
            if (id !== null) {
                requestBody.in_reply_to_status_id = id
            }
            const tweet: any = await client.post('statuses/update', requestBody)
                .catch(function (error: any) {
                    // [ { code: 187, message: 'Status is a duplicate.' } ]
                    console.log(error);
                    console.log(body);
                })

            if (!tweet) {
                await db.collection('posts').doc(postId).update({
                    result: false
                })
                break
            }

            id = tweet.id_str
            screenName = tweet.user.screen_name

            if (isSavedTweetId) {
                continue
            }

            await db.collection('posts').doc(postId).update({
                result: true,
                tweetId: id,
                created_at: new Date().getTime()
            })
            isSavedTweetId = true
        }
    })