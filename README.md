## FINAL PROJECT SERVER

# Homepage

Frontend deployed on - https://myblogcast.vercel.app/

- backup https://blogcast.netlify.app/

Backend deployed on - https://blogcastserver.onrender.com/

- [x] Able to view Blog list created by admin
- [x] Able to select blog by clicking the blog item.
- [x] Navigation to login if not authenticated
- [x] Navigation to Dashboard if authenticated
- [x] able to search blogs via title

# Blog Details

- [x] Able to view blog details www.example.com/:blog_id
- [x] Navigation to login if not authenticated
- [x] Navigation to Dashboard if authenticated

# Login

- [x] Able to sign in existing users www.example.com/login
- [x] Able to show validation errors

# SignUp

- [x] Able to signup users www.example.com/signup
- [x] Able to upload profile_picture
- [x] Able to show validation errors

# Dashboard - Blog

- [x] Able to view blogs created by your user www.example.com/dashboard/blog
- [x] Able to modify existing blogs www.example.com/dashboard/blog/:blog_id
- [x] Able to delete existing blogs
- [x] Able to search blogs via title
- [x] should only be accessible if the user is logged in
- [x] Navigation to Dashboard - Profile / Signout

# Dashboard - Profile

- [x] Able to view user profile details www.example.com/dashboard/profile
- [x] Able to modify user profile details
- [x] Able to change password for 3 chances
- [x] Display validation errors on modification failed
- [x] Should only be accessible if the user is logged in
- [x] Navigation to Dashboard - Blog / Signout

# Notes

- [x] password should be crypto hashed before storing to database
- [x] protected routes and proper redirection must be implemented
- [x] implementation for timestamps is a must (created_at,updated_at,deleted_at)
- [x] deleted records should be soft deleted, meaning instead of removing the column, it should have deleted_at value and must be excluded to future queries
- [x] Implementation for pagination is not required but good to have.
- [x] id implementation is done via uuid npm package.
- [x] you can use either mongodb or mysql
- [x] retrieving of blogs must exclude deleted or is_draft true records
- [x] must be deployed to heroku for actual testing
- [x] must be deployed to atlas(mongodb) or freemysqlhosting(mysql)
