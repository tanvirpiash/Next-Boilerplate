import axios from 'axios';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

async function refreshAccessToken(tokenObject) {
   try {
      const tokenResponse = await axios.post(
         process.env.SERVER_BASE_URL + '5002/api/connect/token',
         {
            grant_type: 'refresh_token',
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            scope: process.env.SCOPE,
            refresh_token: tokenObject.refresh_token,
         },
         {
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded',
            },
         }
      );
      return {
         ...tokenObject,
         access_token: tokenResponse.data.access_token,
         expires_in: Math.round(Date.now() / 1000 + tokenResponse.data.expires_in),
         refresh_token: tokenResponse.data.refresh_token,
      };
   } catch (error) {
      return {
         ...tokenObject,
         error: 'RefreshAccessTokenError',
      };
   }
}

const providers = [
   CredentialsProvider({
      name: 'Credentials',
      authorize: async (credentials) => {
         try {
            const user = await axios.post(
               process.env.SERVER_BASE_URL + '5002/api/connect/token',
               {
                  username: credentials.username,
                  password: credentials.password,
                  grant_type: process.env.GRANT_TYPE,
                  client_id: process.env.CLIENT_ID,
                  client_secret: process.env.CLIENT_SECRET,
                  scope: process.env.SCOPE,
               },
               {
                  headers: {
                     'Content-Type': 'application/x-www-form-urlencoded',
                  },
               }
            );
            if (user.data.access_token) {
               return user.data;
            }
            return null;
         } catch (e) {
            throw new Error(e);
         }
      },
   }),
];

const callbacks = {
   jwt: async ({ token, user }) => {
      if (user) {
         // This will only be executed at login. Each next invocation will skip this part.
         token.access_token = user.access_token;
         token.expires_in = Math.round(Date.now() / 1000 + user.expires_in);
         token.refresh_token = user.refresh_token;
      }

      // If accessTokenExpiry is 24 hours, we have to refresh token before 24 hours pass.
      // const shouldRefreshTime = Math.round(token.expires_in - 60 * 60 * 1000 - Date.now());
      // const shouldRefreshTime = Math.round(token.expires_in - 60);
      let shouldRefreshTime = token.expires_in - 20;
      shouldRefreshTime = Math.round(shouldRefreshTime - Date.now() / 1000);
      // If the token is still valid, just return it.
      if (shouldRefreshTime > 0) {
         return Promise.resolve(token);
      }

      // If the call arrives after 23 hours have passed, we allow to refresh the token.
      token = refreshAccessToken(token);
      return Promise.resolve(token);
   },
   session: async ({ session, token }) => {
      // Here we pass accessToken to the client to be used in authentication with your API
      session.access_token = token.access_token;
      session.expires_in = token.expires_in;
      session.refresh_token = token.refresh_token;
      return Promise.resolve(session);
   },
};

export const options = {
   providers,
   callbacks,
   pages: {},
   secret: 'my_little_secret',
};

const Auth = (req, res) => NextAuth(req, res, options);
export default Auth;
