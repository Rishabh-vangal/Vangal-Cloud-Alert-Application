import React from 'react';
// const {google} = require('googleapis');
// const cloudresourcemanager = google.cloudresourcemanager('v1');

function AzureScreen(props) {


    // const requestOptions = {
    //     method: 'GET',
    //     headers: {'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imh1Tjk1SXZQZmVocTM0R3pCRFoxR1hHaXJuTSIsImtpZCI6Imh1Tjk1SXZQZmVocTM0R3pCRFoxR1hHaXJuTSJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuY29yZS53aW5kb3dzLm5ldC8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8yNmYwYTBhNC1lYWYyLTQ3YjQtYWQ1Yy03OTdlYjQ5ZDg2MDAvIiwiaWF0IjoxNTk0MzMwMjkyLCJuYmYiOjE1OTQzMzAyOTIsImV4cCI6MTU5NDMzNDE5MiwiYWNyIjoiMSIsImFpbyI6IkFVUUF1LzhRQUFBQUI3bVFDVitIQmx2Mzg5WENRSjVsMFJVU1ZIVElyRVZXRCtEUGs4SS8wVlNlY0JDVjdtcGpjZkFMRnVjdkw4L2xlalI3aTYxZDRBdnNWSXhJSEVyUHlBPT0iLCJhbHRzZWNpZCI6IjE6bGl2ZS5jb206MDAwMzdGRkVEOUJCQUM0MCIsImFtciI6WyJwd2QiXSwiYXBwaWQiOiI3ZjU5YTc3My0yZWFmLTQyOWMtYTA1OS01MGZjNWJiMjhiNDQiLCJhcHBpZGFjciI6IjIiLCJlbWFpbCI6InJpc2hhYmgxMDEuOTlAZ21haWwuY29tIiwiZmFtaWx5X25hbWUiOiJKYWluIiwiZ2l2ZW5fbmFtZSI6IlJpc2hhYmgiLCJncm91cHMiOlsiOTA3ZGUyMWItNzk5Ny00NWM0LWI5ZmEtNzBiZGIwN2Y1ZDg4Il0sImlkcCI6ImxpdmUuY29tIiwiaXBhZGRyIjoiNzEuMjI3LjIzOS42MyIsIm5hbWUiOiJSaXNoYWJoIEphaW4iLCJvaWQiOiJhYmRhZjkzOC05NjBkLTRlNjgtYjEwMi0wNzk5MmU2N2IxZDgiLCJwdWlkIjoiMTAwMzIwMDA0NDRDRTA5RCIsInJoIjoiMC5BVFlBcEtEd0p2THF0RWV0WEhsLXRKMkdBSE9uV1gtdkxweENvRmxRX0Z1eWkwUTJBRFkuIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic3ViIjoiSy13aEhxQ0RYR2I4bi1KejljX3NLNmVKemJjbmVIeWdrM2ZkT1p6YjljSSIsInRpZCI6IjI2ZjBhMGE0LWVhZjItNDdiNC1hZDVjLTc5N2ViNDlkODYwMCIsInVuaXF1ZV9uYW1lIjoibGl2ZS5jb20jcmlzaGFiaDEwMS45OUBnbWFpbC5jb20iLCJ1dGkiOiJybjFxekd1aFdrV2lXaWhYNlNZb0FBIiwidmVyIjoiMS4wIiwid2lkcyI6WyI2MmU5MDM5NC02OWY1LTQyMzctOTE5MC0wMTIxNzcxNDVlMTAiXX0.JGN8Wkekk7DmMLw0YRn-iSxufy19BZFkcfuC0Vjre4CNB7Zz_G0eMyKOito7YTJuC2jEAUceehrx9EiiOp_w4nByKwZGXxwEXObNr1K8SVbaNCTytN-8HdhRHEtxzKLgeCuqH9FapcFH4eUTzH-TSA0XxJd9i1XUJvMd1-wE03X87TttDsWDKiyK2QHtaoAjLLPoFwGoUTgWJ1byy2OBr068c3pfSxLttgNegzz3nszn_OHLlSCQeHJV0PU4E0cQrRYS_O2lSz8sBx1rmZ1si3BGDyLoPEJnvJayBhZwkPm4GkZLPbWT7PgGQNJaooi7Gzjs0KXfP1fnsGtUquGS_A'}
    //     };
    //     fetch('https://management.azure.com/providers/Microsoft.Billing/billingAccounts?api-version=2019-10-01-preview', requestOptions)
    //     .then(async response => {
    //         const data = await response.json();
    //         console.log(data);
    // });

    const requestOptions1 = {
        method: 'GET'
    };
    const tenantId = props.data.data.authResponseWithAccessToken.idToken.tenantId;
    console.log(tenantId);
    fetch('https://login.microsoftonline.com/' + tenantId + '/oauth2/v2.0/authorize?client_id=1854d86b-8e91-4db9-846e-0da965c041d6&response_type=code&redirect_uri=http://localhost:3000&response_mode=query&scope=openid%20offline_access%20https%3A%2F%2Fgraph.microsoft.com%2Fmail.read&state=12345', requestOptions1)
        .then(async response => {
            const data = await response.json();
            console.log(data);
    });

    return (
        <div>
            <h1>You're logged in with Azure</h1>
            <p>Check the console log for more data</p>
            
        </div>
    );
}

export default AzureScreen;