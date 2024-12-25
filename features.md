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