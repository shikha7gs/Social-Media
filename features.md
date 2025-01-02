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

 ### Adding post and delete:
  - User could write title, select category and write description in md.
  - when api is called, it generates a uid and store the post in posts array which is in a special document with username.
  - Gave ellipsis, so click and get btn to copy link and delete that post.
  - when click on delete it calls api which look for that uid in user document.

 ### Page show
  - Made a page- post/[uid] to show post, when page is loaded, it calls api findPost which look everywhere with uid and id get any post so it brings the post and details of owner.
  - It shows the md description in good way using unified.

 ### show profiles and follow
  - Now user could get others profile and follow them easily.- /profile/[userName]
  - When user click on folllow or unfollow it will call API- followOrUnfollow which will check whether it has t follow or unfollow then update Db then boom.

 ### Like Posts
  - Now user could like posts.
  - When user like or dislike it calls likeOrUnlike API which will add the userName in likes and add in likePosts in metadata as well to contain info as what all has been liked. and In dislike it removes the username from arr.
 
 ### Feed
  - In home user could see posts as reels.
  - When page reloads in calls - `app\api\user\getRecommendPosts\route.js` , Under it , it firstly get user details and see what user likes, which category then show such post, It prioritize same category post of followings than rest similar category post. Ater getting category it brings the post and shows.