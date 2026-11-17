# LemonBingo 🍋

LemonBingo is a Reddit-style community website connected to Supabase.

## Features

- Shared accounts with email and password
- Public profiles with unique usernames
- Shared communities, posts, comments, and votes
- Live updates across open browsers
- Home, popular, and new feeds
- Hot, new, and top sorting
- Search posts and communities
- Responsive desktop and mobile layout

## Deploy

The site is a static frontend. Connect this repository to Vercel and deploy the `main` branch. No build command is required.

The frontend connects to the LemonBingo Supabase project using its public publishable key. That key is intended for browser use; database access is restricted with Row Level Security (RLS). Never put a Supabase secret or service-role key in this repository.

## Backend

Supabase stores the app's data in these tables:

- `profiles`
- `communities`
- `posts`
- `comments`
- `votes`

RLS is enabled on every table. Visitors can read public community content; signed-in users can create content and can edit or delete only their own rows. A user can have one vote per post.

## Notes

- New accounts may need to confirm their email before signing in, depending on the Supabase Auth settings.
- The initial communities are seeded in the database.
- This is an early community-site build. Moderation, reporting, image uploads, and password-reset UI are not included yet.
