
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createUnsubscribeToken } from './src/lib/newsletter/unsubscribe-token';

const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

async function testUnsubscribe() {
  // 1. Create a subscriber
  const subscriber = {
    email: 'test@example.com',
    status: 'active',
  };
  const subscriberRef = await db.collection('newsletterSubscriptions').add(subscriber);
  const subscriberId = subscriberRef.id;
  console.log(`Created subscriber with ID: ${subscriberId}`);

  // 2. Generate an unsubscribe token
  const token = createUnsubscribeToken(subscriberId);
  console.log(`Generated token: ${token}`);

  // 3. Make a POST request to the /api/newsletter/unsubscribe endpoint
  const response = await fetch('http://localhost:3000/api/newsletter/unsubscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  const data = await response.json();
  console.log('Response from API:', data);

  // 4. Verify the subscriber's status in Firestore
  const updatedSubscriberDoc = await db.collection('newsletterSubscriptions').doc(subscriberId).get();
  const updatedSubscriber = updatedSubscriberDoc.data();
  console.log('Updated subscriber:', updatedSubscriber);

  if (updatedSubscriber?.status === 'unsubscribed') {
    console.log('Test passed!');
  } else {
    console.error('Test failed!');
  }

  // Clean up
  await db.collection('newsletterSubscriptions').doc(subscriberId).delete();
  console.log('Cleaned up subscriber.');
}

testUnsubscribe();
