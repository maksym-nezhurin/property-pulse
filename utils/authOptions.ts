import connectDB from "@/config/database";
import User from "@/models/User";
import GoogleProvider from "next-auth/providers/google";

interface IProfile {
    name: string;
    email: string;
    picture: string;
}

interface ISession {
    user: {
        email: string;
        id: string;
    };
}

export const authOptions = {
    providers: [
        GoogleProvider({
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        })
    ],
    callbacks: {
        // invoked on successful signin
        async signIn({ profile }: { profile: IProfile}): Promise<boolean> {
            // 1.Connect to database
            await connectDB();
            // 2. Check if user exists
            const userExists = await User.findOne({ email: profile.email });
            // 3. if not, then add user to database
            if (!userExists) {
                // Truncate username if too long

                const username = profile.name.slice(0, 20);

                await User.create({
                    email: profile.email,
                    username,
                    image: profile.picture
                })
            }
            // 4. Return true to allow sign in
            return true;
        },

        // Modifies the session object
        async session({ session }: { session: ISession}) {
            // 1. Get user from database
            const user = await User.findOne({ email: session.user.email })
            // 2. Assign the user id to the session
            session.user.id = user._id.toString();
            // 3. Return session
            return session;
        }
    }
}
