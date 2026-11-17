# LemonBingo 🍋

LemonBingo is a Reddit-style community website connected to Supabase.

## Features

- Username-and-password account screens
- Public profiles with unique usernames
- Shared communities, posts, comments, and votes
- Text posts, video posts, and vertical Shorts
- Live updates across open browsers
- Home, popular, new, videos, and shorts feeds
- Hot, new, and top sorting
- Search posts and communities
- Responsive desktop and mobile layout

## Video and Shorts

Members can create a Video or Short post by providing a direct HTTPS video URL. The player supports browser-playable video formats such as MP4 and WebM. Direct file uploads are not enabled yet.

## Deploy

The site is a static frontend. Connect this repository to Vercel and deploy the `main` branch. No build command is required.

The frontend connects to the LemonBingo Supabase project using its public publishable key. That key is intended for browser use; database access is restricted with Row Level Security (RLS). Never put a Supabase secret or service-role key in this repository.

## Backend

Supabase stores the app's data in these tables:

- `profiles`
- `communities`
- `posts` (including `post_type` and `media_url`)
- `comments`
- `votes`

RLS is enabled on every table. Visitors can read public community content; signed-in users can create content and can edit or delete only their own rows. A user can have one vote per post.

## Auth setup

The account form asks for a username and password. Supabase Auth still handles the secure password/session work behind the scenes using a non-deliverable internal email alias derived from the username. In the Supabase Dashboard, turn off **Confirm email** under **Authentication → Sign In / Providers → Email** so account creation does not require email verification.

Existing accounts that were created with real email addresses can still sign in by entering that email in the username field until they are migrated.

## Notes

- The initial communities are seeded in the database.
- This is an early community-site build. Video file uploads, moderation, reporting, image uploads, and password-reset UI are not included yet.

## Community features

LemonBingo includes public community feeds, text/video/Shorts posts, image and video uploads through Supabase Storage, threaded comments, voting, polls, saved posts, followed-user feeds, profile editing, notifications, community creation, reports, moderator review, user blocking, and mutual-follow-only direct messages.

### Supabase setup

The current app uses the public Supabase project configured in `index.html`. The schema includes tables for `saved_posts`, `follows`, `notifications`, `user_blocks`, `direct_messages`, `community_members`, `reports`, `polls`, `poll_options`, and `poll_votes`. Media is stored in the public `lemon-media` bucket with authenticated uploads restricted to each user's own folder.

The app is open source. Contributions and forks are welcome; review database policies before deploying schema changes to another Supabase project.


## Android APK

The Android app is built from the same website using Capacitor. GitHub Actions automatically builds a debug APK when the web app or Android configuration changes on `main`, and when manually started from the Actions tab.

- Open the repository's **Actions** tab and select **Build LemonBingo APK**.
- Download **LemonBingo-Android-APK** from the completed workflow run's Artifacts section.
- To publish an APK on the repository's Releases page, push a version tag such as `v1.0.0`; the workflow attaches the APK to that GitHub Release.

The APK uses the existing LemonBingo website and Supabase backend. It is currently an unsigned debug build for testing, not a Play Store release build.
