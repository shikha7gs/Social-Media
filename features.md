### Sign up:
 - Verify every parameters in frontend and backend
 - Store hash password

### log in:
 - Verify every parameter in frontend and back end.
 - Compare password using bcrypt.compare
 - Generated a session id with username linked and set in cookie with ip and user device for knowing that user is there then expire after 24 hr.

 ### Forget Pass:
 - Send otp and return uuid then verify using uuid then add cookie with session id and redirect

 ### Rate limit:
 - Added rate limit in every api except check username

 ### Profile:
 - Check session id.
 - If user is entering here for 1st time, a document is created for meta data(user details) and posts.
 - render all data and show dynamically.

 ### Modify Profile:
 - it will check session id and based on it bring and keep datas qnd user couldchange the data even images, banner and all.
 - when done it will request a post req at update profile then there it will ask for changes made in keys and newuser data and based on it it will change.

 ### CORS and restrictions:
 - Added CORS with only my domain.

 ### Token on every Request:
 - Problem: By cors we could stop calling our apis externally in browsee but even now someone could use our api using curl, postman etc.
 - Solution: I have made a token system where in func/generate_token.js I generate id and make a token using jwt then whenever user call this function it will give token and id when browser request using this token and keep id as data, in server I check whether token is valid and decrypt using secret key and check dsscrypted id with user browser given id, attacker will not be able to generate. yey.