// AWS.config.region = 'us-east-1';
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: 'us-east-1:21e5d2d6-a954-4e4a-8f67-39725835621d',
// });

// googleAuth = response => {
//   console.log(response);
//   const idToken = response.tokenId;
//   const profile = response.profileObj;

//   AWS.config.credentials.params.Logins = {};
//   AWS.config.credentials.params.Logins["accounts.google.com"] = idToken;

//   AWS.config.credentials.get(() => {
//     const client = new AWS.CognitoSyncManager()

//     client.openOrCreateDataset("profile", (err, dataset) => {
//       // Set id only if one doesn't exist
//       profile.id = uuidv4()

//       dataset.putAll(profile, (err, record) => {
//         console.log("record", record);

//         dataset.synchronize({
//           onSuccess(data, newRecords) {
//             // Set token and profile to localStorage 
//             localStorage.setItem('pkgRadarIdToken', idToken)
//             localStorage.setItem('pkgRadarProfile', JSON.stringify(profile))

//             console.log('sync success')
//             console.log('profile', profile)
//           },
//           onFailure(err) {
//             console.error(err);
//           }
//         });
//       });
//     });
//   });
// };