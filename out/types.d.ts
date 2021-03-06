/** The class for a snoowrap requester.
 * A requester is the base object that is used to fetch content from reddit. Each requester contains a single set of OAuth
tokens.
If constructed with a refresh token, a requester will be able to repeatedly generate access tokens as necessary, without any
further user intervention. After making at least one request, a requester will have the `access_token` property, which specifies
the access token currently in use. It will also have a few additional properties such as `scope` (an array of scope strings)
and `ratelimitRemaining` (the number of requests remaining for the current 10-minute interval, in compliance with reddit's
[API rules](https://github.com/reddit/reddit/wiki/API).) These properties primarily exist for internal use, but they are
exposed since they are useful externally as well.
 */
declare class snoowrap {
   /** The class for a snoowrap requester.
    * A requester is the base object that is used to fetch content from reddit. Each requester contains a single set of OAuth
   tokens.
   If constructed with a refresh token, a requester will be able to repeatedly generate access tokens as necessary, without any
   further user intervention. After making at least one request, a requester will have the `access_token` property, which specifies
   the access token currently in use. It will also have a few additional properties such as `scope` (an array of scope strings)
   and `ratelimitRemaining` (the number of requests remaining for the current 10-minute interval, in compliance with reddit's
   [API rules](https://github.com/reddit/reddit/wiki/API).) These properties primarily exist for internal use, but they are
   exposed since they are useful externally as well.
    */
   constructor(options: { userAgent: string, clientId: string, clientSecret: string, username: string, password: string, refreshToken: string, accessToken: string });

   /**
    * @summary Gets an authorization URL, which allows a user to authorize access to their account
    * @desc This create a URL where a user can authorize an app to act through their account. If the user visits the returned URL
   in a web browser, they will see a page that looks like [this](https://i.gyazo.com/0325534f38b78c1dbd4c84d690dda6c2.png). If
   the user clicks "Allow", they will be redirected to your `redirectUri`, with a `code` querystring parameter containing an
    * *authorization code*. If this code is passed to {@link snoowrap.fromAuthCode}, you can create a requester to make
   requests on behalf of the user.
    *
    * The main use-case here is for running snoowrap in a browser. You can generate a URL, send the user there, and then continue
   after the user authenticates on reddit and is redirected back.
    *
    * @param {object} options
    * @param {string} options.clientId The client ID of your app (assigned by reddit). If your code is running clientside in a
   browser, using an "Installed" app type is recommended.
    * @param {string[]} options.scope An array of scopes (permissions on the user's account) to request on the authentication
   page. A list of possible scopes can be found [here](https://www.reddit.com/api/v1/scopes). You can also get them on-the-fly
   with {@link snoowrap#getOauthScopeList}.
    * @param {string} options.redirectUri The URL where the user should be redirected after authenticating. This **must** be the
   same as the redirect URI that is configured for the reddit app. (If there is a mismatch, the returned URL will display an
   error page instead of an authentication form.)
    * @param {boolean} options.permanent=true If `true`, the app will have indefinite access to the user's account. If `false`,
   access to the user's account will expire after 1 hour.
    * @param {string} [options.state] A string that can be used to verify a user after they are redirected back to the site. When
   the user is redirected from reddit, to the redirect URI after authenticating, the resulting URI will have this same `state`
   value in the querystring. (See [here](http://www.twobotechnologies.com/blog/2014/02/importance-of-state-in-oauth2.html) for
   more information on how to use the `state` value.)
    * @param {string} [options.endpointDomain='reddit.com'] The endpoint domain for the URL. If the user is authenticating on
   reddit.com (as opposed to some other site with a reddit-like API), you can omit this value.
    * @returns {string} A URL where the user can authenticate with the given options
    * @example
    *
    * var authenticationUrl = snoowrap.getAuthUrl({
    *   clientId: 'foobarbazquuux',
    *   scope: ['identity', 'wikiread', 'wikiedit'],
    *   redirectUri: 'https://example.com/reddit_callback',
    *   permanent: false,
    *   state: 'fe211bebc52eb3da9bef8db6e63104d3' // a random string, this could be validated when the user is redirected back
    * });
    * // --> 'https://www.reddit.com/api/v1/authorize?client_id=foobarbaz&response_type=code&state= ...'
    *
    * window.location = authenticationUrl; // send the user to the authentication url
    */
   static getAuthUrl(options: { clientId: string, scope: string[], redirectUri: string, permanent: boolean, state: string, endpointDomain: string }): string;

   /**
    * @summary Creates a snoowrap requester from an authorization code.
    * @desc An authorization code is the `code` value that appears in the querystring after a user authenticates with reddit and
   is redirected. For more information, see {@link snoowrap.getAuthUrl}.
    *
    * The main use-case for this function is for running snoowrap in a browser. You can generate a URL with
   {@link snoowrap.getAuthUrl} and send the user to that URL, and then use this function to create a requester when
   the user is redirected back with an authorization code.
    * @param {object} options
    * @param {string} options.code The authorization code
    * @param {string} options.userAgent A unique description of what your app does. This argument is not necessary when snoowrap
   is running in a browser.
    * @param {string} options.clientId The client ID of your app (assigned by reddit). If your code is running clientside in a
   browser, using an "Installed" app type is recommended.
    * @param {string} [options.clientSecret] The client secret of your app. If your app has the "Installed" app type, omit
   this parameter.
    * @param {string} options.redirectUri The redirect URI that is configured for the reddit app.
    * @param {string} [options.endpointDomain='reddit.com'] The endpoint domain that the returned requester should be configured
   to use. If the user is authenticating on reddit.com (as opposed to some other site with a reddit-like API), you can omit this
   value.
    * @returns {Promise} A Promise that fulfills with a `snoowrap` instance
    * @example
    *
    * // Get the `code` querystring param (assuming the user was redirected from reddit)
    * var code = new URL(window.location.href).searchParams.get('code');
    *
    * snoowrap.fromAuthCode({
    *   code: code,
    *   userAgent: 'My app',
    *   clientId: 'foobarbazquuux',
    *   redirectUri: 'example.com'
    * }).then(r => {
    *   // Now we have a requester that can access reddit through the user's account
    *   return r.getHot().then(posts => {
    *     // do something with posts from the front page
    *   });
    * })
    */
   static fromAuthCode(options: { code: string, userAgent: string, clientId: string, clientSecret: string, redirectUri: string, endpointDomain: string }): Promise;

   /**
    * @summary Retrieves or modifies the configuration options for this requester.
    * @param {object} [options] A map of `{[config property name]: value}`. Note that any omitted config properties will simply
   retain whatever value they had previously. (In other words, if you only want to change one property, you only need to put
   that one property in this parameter. To get the current configuration without modifying anything, simply omit this
   parameter.)
    * @param {string} [options.endpointDomain='reddit.com'] The endpoint where requests should be sent
    * @param {Number} [options.requestDelay=0] A minimum delay, in milliseconds, to enforce between API calls. If multiple
   api calls are requested during this timespan, they will be queued and sent one at a time. Setting this to more than 1000 will
   ensure that reddit's ratelimit is never reached, but it will make things run slower than necessary if only a few requests
   are being sent. If this is set to zero, snoowrap will not enforce any delay between individual requests. However, it will
   still refuse to continue if reddit's enforced ratelimit (600 requests per 10 minutes) is exceeded.
    * @param {Number} [options.requestTimeout=30000] A timeout for all OAuth requests, in milliseconds. If the reddit server
   fails to return a response within this amount of time, the Promise will be rejected with a timeout error.
    * @param {boolean} [options.continueAfterRatelimitError=false] Determines whether snoowrap should queue API calls if
   reddit's ratelimit is exceeded. If set to `true` when the ratelimit is exceeded, snoowrap will queue all further requests,
   and will attempt to send them again after the current ratelimit period expires (which happens every 10 minutes). If set
   to `false`, snoowrap will simply throw an error when reddit's ratelimit is exceeded.
    * @param {Number[]} [options.retryErrorCodes=[502, 503, 504, 522]] If reddit responds to an idempotent request with one of
   these error codes, snoowrap will retry the request, up to a maximum of `max_retry_attempts` requests in total. (These
   errors usually indicate that there was an temporary issue on reddit's end, and retrying the request has a decent chance of
   success.) This behavior can be disabled by simply setting this property to an empty array.
    * @param {Number} [options.maxRetryAttempts=3] See `retryErrorCodes`.
    * @param {boolean} [options.warnings=true] snoowrap may occasionally log warnings, such as deprecation notices, to the
   console. These can be disabled by setting this to `false`.
    * @param {boolean} [options.debug=false] If set to true, snoowrap will print out potentially-useful information for debugging
   purposes as it runs.
    * @param {boolean} [options.proxies=true] Setting this to `false` disables snoowrap's method-chaining feature. This causes
   the syntax for using snoowrap to become a bit heavier, but allows for consistency between environments that support the ES6
   `Proxy` object and environments that don't. This option is a no-op in environments that don't support the `Proxy` object,
   since method chaining is always disabled in those environments.
    * @returns {object} An updated Object containing all of the configuration values
    * @example
    *
    * r.config({requestDelay: 1000, warnings: false});
    * // sets the request delay to 1000 milliseconds, and suppresses warnings.
    */
   config(options?: { endpointDomain: string, requestDelay: Number, requestTimeout: Number, continueAfterRatelimitError: boolean, retryErrorCodes: Number[], maxRetryAttempts: Number, warnings: boolean, debug: boolean, proxies: boolean }): Object;

   /**
    * @summary Gets information on a reddit user with a given name.
    * @param {string} name - The user's username
    * @returns {RedditUser} An unfetched RedditUser object for the requested user
    * @example
    *
    * r.getUser('not_an_aardvark')
    * // => RedditUser { name: 'not_an_aardvark' }
    * r.getUser('not_an_aardvark').link_karma.then(console.log)
    * // => 6
    */
   getUser(name: string): RedditUser;

   /**
    * @summary Gets information on a comment with a given id.
    * @param {string} commentId - The base36 id of the comment
    * @returns {Comment} An unfetched Comment object for the requested comment
    * @example
    *
    * r.getComment('c0b6xx0')
    * // => Comment { name: 't1_c0b6xx0' }
    * r.getComment('c0b6xx0').author.name.then(console.log)
    * // => 'Kharos'
    */
   getComment(commentId: string): Comment;

   /**
    * @summary Gets information on a given subreddit.
    * @param {string} displayName - The name of the subreddit (e.g. 'AskReddit')
    * @returns {Subreddit} An unfetched Subreddit object for the requested subreddit
    * @example
    *
    * r.getSubreddit('AskReddit')
    * // => Subreddit { display_name: 'AskReddit' }
    * r.getSubreddit('AskReddit').created_utc.then(console.log)
    * // => 1201233135
    */
   getSubreddit(displayName: string): Subreddit;

   /**
    * @summary Gets information on a given submission.
    * @param {string} submissionId - The base36 id of the submission
    * @returns {Submission} An unfetched Submission object for the requested submission
    * @example
    *
    * r.getSubmission('2np694')
    * // => Submission { name: 't3_2np694' }
    * r.getSubmission('2np694').title.then(console.log)
    * // => 'What tasty food would be distusting if eaten over rice?'
    */
   getSubmission(submissionId: string): Submission;

   /**
    * @summary Gets a private message by ID.
    * @param {string} messageId The base36 ID of the message
    * @returns {PrivateMessage} An unfetched PrivateMessage object for the requested message
    * @example
    *
    * r.getMessage('51shnw')
    * // => PrivateMessage { name: 't4_51shnw' }
    * r.getMessage('51shnw').subject.then(console.log)
    * // => 'Example'
    * // See here for a screenshot of the PM in question https://i.gyazo.com/24f3b97e55b6ff8e3a74cb026a58b167.png
    */
   getMessage(messageId: string): PrivateMessage;

   /**
    * Gets a livethread by ID.
    * @param {string} threadId The base36 ID of the livethread
    * @returns {LiveThread} An unfetched LiveThread object
    * @example
    *
    * r.getLivethread('whrdxo8dg9n0')
    * // => LiveThread { id: 'whrdxo8dg9n0' }
    * r.getLivethread('whrdxo8dg9n0').nsfw.then(console.log)
    * // => false
    */
   getLivethread(threadId: string): LiveThread;

   /**
    * @summary Gets information on the requester's own user profile.
    * @returns {RedditUser} A RedditUser object corresponding to the requester's profile
    * @example
    *
    * r.getMe().then(console.log);
    * // => RedditUser { is_employee: false, has_mail: false, name: 'snoowrap_testing', ... }
    */
   getMe(): RedditUser;

   /**
    * @summary Gets a distribution of the requester's own karma distribution by subreddit.
    * @returns {Promise} A Promise for an object with karma information
    * @example
    *
    * r.getKarma().then(console.log)
    * // => [
    * //  { sr: Subreddit { display_name: 'redditdev' }, comment_karma: 16, link_karma: 1 },
    * //  { sr: Subreddit { display_name: 'programming' }, comment_karma: 2, link_karma: 1 },
    * //  ...
    * // ]
    */
   getKarma(): Promise;

   /**
    * @summary Gets information on the user's current preferences.
    * @returns {Promise} A promise for an object containing the user's current preferences
    * @example
    *
    * r.getPreferences().then(console.log)
    * // => { default_theme_sr: null, threaded_messages: true, hide_downs: false, ... }
    */
   getPreferences(): Promise;

   /**
    * @summary Updates the user's current preferences.
    * @param {object} updatedPreferences An object of the form {[some preference name]: 'some value', ...}. Any preference
    * not included in this object will simply retain its current value.
    * @returns {Promise} A Promise that fulfills when the request is complete
    * @example
    *
    * r.updatePreferences({threaded_messages: false, hide_downs: true})
    * // => { default_theme_sr: null, threaded_messages: false,hide_downs: true, ... }
    * // (preferences updated on reddit)
    */
   updatePreferences(updatedPreferences: Object): Promise;

   /**
    * @summary Gets the currently-authenticated user's trophies.
    * @returns {Promise} A TrophyList containing the user's trophies
    * @example
    *
    * r.getMyTrophies().then(console.log)
    * // => TrophyList { trophies: [
    * //   Trophy { icon_70: 'https://s3.amazonaws.com/redditstatic/award/verified_email-70.png',
    * //     description: null,
    * //     url: null,
    * //     icon_40: 'https://s3.amazonaws.com/redditstatic/award/verified_email-40.png',
    * //     award_id: 'o',
    * //     id: '16fn29',
    * //     name: 'Verified Email'
    * //   }
    * // ] }
    */
   getMyTrophies(): Promise;

   /**
    * @summary Gets the list of the currently-authenticated user's friends.
    * @returns {Promise} A Promise that resolves with a list of friends
    * @example
    *
    * r.getFriends().then(console.log)
    * // => [ [ RedditUser { date: 1457927963, name: 'not_an_aardvark', id: 't2_k83md' } ], [] ]
    */
   getFriends(): Promise;

   /**
    * @summary Gets the list of people that the currently-authenticated user has blocked.
    * @returns {Promise} A Promise that resolves with a list of blocked users
    * @example
    *
    * r.getBlockedUsers().then(console.log)
    * // => [ RedditUser { date: 1457928120, name: 'actually_an_aardvark', id: 't2_q3519' } ]
    */
   getBlockedUsers(): Promise;

   /**
    * @summary Determines whether the currently-authenticated user needs to fill out a captcha in order to submit content.
    * @returns {Promise} A Promise that resolves with a boolean value
    * @example
    *
    * r.checkCaptchaRequirement().then(console.log)
    * // => false
    */
   checkCaptchaRequirement(): Promise;

   /**
    * @summary Gets the identifier (a hex string) for a new captcha image.
    * @returns {Promise} A Promise that resolves with a string
    * @example
    *
    * r.getNewCaptchaIdentifier().then(console.log)
    * // => 'o5M18uy4mk0IW4hs0fu2GNPdXb1Dxe9d'
    */
   getNewCaptchaIdentifier(): Promise;

   /**
    * @summary Gets an image for a given captcha identifier.
    * @param {string} identifier The captcha identifier.
    * @returns {Promise} A string containing raw image data in PNG format
    * @example
    *
    * r.getCaptchaImage('o5M18uy4mk0IW4hs0fu2GNPdXb1Dxe9d').then(console.log)
   // => (A long, incoherent string representing the image in PNG format)
    */
   getCaptchaImage(identifier: string): Promise;

   /**
    * @summary Gets an array of categories that items can be saved in. (Requires reddit gold)
    * @returns {Promise} An array of categories
    * @example
    *
    * r.getSavedCategories().then(console.log)
    * // => [ { category: 'cute cat pictures' }, { category: 'interesting articles' } ]
    */
   getSavedCategories(): Promise;

   /**
    * @summary Marks a list of submissions as 'visited'.
    * @desc **Note**: This endpoint only works if the authenticated user is subscribed to reddit gold.
    * @param {Submission[]} links A list of Submission objects to mark
    * @returns {Promise} A Promise that fulfills when the request is complete
    * @example
    *
    * var submissions = [r.getSubmission('4a9u54'), r.getSubmission('4a95nb')]
    * r.markAsVisited(submissions)
    * // (the links will now appear purple on reddit)
    */
   markAsVisited(links: Submission[]): Promise;

   /**
    * @summary Creates a new selfpost on the given subreddit.
    * @param {object} options An object containing details about the submission
    * @param {string} options.subredditName The name of the subreddit that the post should be submitted to
    * @param {string} options.title The title of the submission
    * @param {string} [options.text] The selftext of the submission
    * @param {boolean} [options.sendReplies=true] Determines whether inbox replies should be enabled for this submission
    * @param {string} [options.captchaIden] A captcha identifier. This is only necessary if the authenticated account
   requires a captcha to submit posts and comments.
    * @param {string} [options.captchaResponse] The response to the captcha with the given identifier
    * @returns {Promise} The newly-created Submission object
    * @example
    *
    * r.submitSelfpost({
    *   subredditName: 'snoowrap_testing',
    *   title: 'This is a selfpost',
    *   body: 'This is the body of the selfpost'
    * }).then(console.log)
    * // => Submission { name: 't3_4abmsz' }
    * // (new selfpost created on reddit)
    */
   submitSelfpost(options: { subredditName: string, title: string, text: string, sendReplies: boolean, captchaIden: string, captchaResponse: string }): Promise;

   /**
    * @summary Creates a new link submission on the given subreddit.
    * @param {object} options An object containing details about the submission
    * @param {string} options.subredditName The name of the subreddit that the post should be submitted to
    * @param {string} options.title The title of the submission
    * @param {string} options.url The url that the link submission should point to
    * @param {boolean} [options.sendReplies=true] Determines whether inbox replies should be enabled for this submission
    * @param {boolean} [options.resubmit=true] If this is false and same link has already been submitted to this subreddit in
   the past, reddit will return an error. This could be used to avoid accidental reposts.
    * @param {string} [options.captchaIden] A captcha identifier. This is only necessary if the authenticated account
   requires a captcha to submit posts and comments.
    * @param {string} [options.captchaResponse] The response to the captcha with the given identifier
    * @returns {Promise} The newly-created Submission object
    * @example
    *
    * r.submitLink({
    *   subredditName: 'snoowrap_testing',
    *   title: 'I found a cool website!',
    *   url: 'https://google.com'
    * }).then(console.log)
    * // => Submission { name: 't3_4abnfe' }
    * // (new linkpost created on reddit)
    */
   submitLink(options: { subredditName: string, title: string, url: string, sendReplies: boolean, resubmit: boolean, captchaIden: string, captchaResponse: string }): Promise;

   /**
    * @summary Gets a Listing of hot posts.
    * @param {string} [subredditName] The subreddit to get posts from. If not provided, posts are fetched from
   the front page of reddit.
    * @param {object} [options={}] Options for the resulting Listing
    * @returns {Promise} A Listing containing the retrieved submissions
    * @example
    *
    * r.getHot().then(console.log)
    * // => Listing [
    * //  Submission { domain: 'imgur.com', banned_by: null, subreddit: Subreddit { display_name: 'pics' }, ... },
    * //  Submission { domain: 'i.imgur.com', banned_by: null, subreddit: Subreddit { display_name: 'funny' }, ... },
    * //  ...
    * // ]
    *
    * r.getHot('gifs').then(console.log)
    * // => Listing [
    * //  Submission { domain: 'i.imgur.com', banned_by: null, subreddit: Subreddit { display_name: 'gifs' }, ... },
    * //  Submission { domain: 'i.imgur.com', banned_by: null, subreddit: Subreddit { display_name: 'gifs' }, ... },
    * //  ...
    * // ]
    *
    * r.getHot('redditdev', {limit: 1}).then(console.log)
    * // => Listing [
   //   Submission { domain: 'self.redditdev', banned_by: null, subreddit: Subreddit { display_name: 'redditdev' }, ...}
    * // ]
    */
   getHot(subredditName?: string, options?: Object): Promise;

   /**
    * @summary Gets a Listing of new posts.
    * @param {string} [subredditName] The subreddit to get posts from. If not provided, posts are fetched from
   the front page of reddit.
    * @param {object} [options={}] Options for the resulting Listing
    * @returns {Promise} A Listing containing the retrieved submissions
    * @example
    *
    * r.getNew().then(console.log)
    * // => Listing [
    * //  Submission { domain: 'self.Jokes', banned_by: null, subreddit: Subreddit { display_name: 'Jokes' }, ... },
    * //  Submission { domain: 'self.AskReddit', banned_by: null, subreddit: Subreddit { display_name: 'AskReddit' }, ... },
    * //  ...
    * // ]
    *
    */
   getNew(subredditName?: string, options?: Object): Promise;

   /**
    * @summary Gets a Listing of new comments.
    * @param {string} [subredditName] The subreddit to get comments from. If not provided, posts are fetched from
   the front page of reddit.
    * @param {object} [options={}] Options for the resulting Listing
    * @returns {Promise} A Listing containing the retrieved comments
    * @example
    *
    * r.getNewComments().then(console.log)
    * // => Listing [
    * //  Comment { link_title: 'What amazing book should be made into a movie, but hasn\'t been yet?', ... }
    * //  Comment { link_title: 'How far back in time could you go and still understand English?', ... }
    * // ]
    */
   getNewComments(subredditName?: string, options?: Object): Promise;

   /**
    * @summary Gets a single random Submission.
    * @desc **Note**: This function will not work when snoowrap is running in a browser, because the reddit server sends a
   redirect which cannot be followed by a CORS request.
    * @param {string} [subredditName] The subreddit to get the random submission. If not provided, the post is fetched from
   the front page of reddit.
    * @returns {Promise} The retrieved Submission object
    * @example
    *
    * r.getRandomSubmission('aww').then(console.log)
    * // => Submission { domain: 'i.imgur.com', banned_by: null, subreddit: Subreddit { display_name: 'aww' }, ... }
    */
   getRandomSubmission(subredditName?: string): Promise;

   /**
    * @summary Gets a Listing of top posts.
    * @param {string} [subredditName] The subreddit to get posts from. If not provided, posts are fetched from
   the front page of reddit.
    * @param {object} [options={}] Options for the resulting Listing
    * @param {string} [options.time] Describes the timespan that posts should be retrieved from. Should be one of
   `hour, day, week, month, year, all`
    * @returns {Promise} A Listing containing the retrieved submissions
    * @example
    *
    * r.getTop({time: 'all', limit: 2}).then(console.log)
    * // => Listing [
    * //  Submission { domain: 'self.AskReddit', banned_by: null, subreddit: Subreddit { display_name: 'AskReddit' }, ... },
    * //  Submission { domain: 'imgur.com', banned_by: null, subreddit: Subreddit { display_name: 'funny' }, ... }
    * // ]
    *
    * r.getTop('AskReddit').then(console.log)
    * // => Listing [
    * //  Submission { domain: 'self.AskReddit', banned_by: null, subreddit: Subreddit { display_name: 'AskReddit' }, ... },
    * //  Submission { domain: 'self.AskReddit', banned_by: null, subreddit: Subreddit { display_name: 'AskReddit' }, ... },
    * //  Submission { domain: 'self.AskReddit', banned_by: null, subreddit: Subreddit { display_name: 'AskReddit' }, ... },
    * //  ...
    * // ]
    */
   getTop(subredditName?: string, options?: { time: string }): Promise;

   /**
    * @summary Gets a Listing of controversial posts.
    * @param {string} [subredditName] The subreddit to get posts from. If not provided, posts are fetched from
   the front page of reddit.
    * @param {object} [options={}] Options for the resulting Listing
    * @param {string} [options.time] Describes the timespan that posts should be retrieved from. Should be one of
   `hour, day, week, month, year, all`
    * @returns {Promise} A Listing containing the retrieved submissions
    * @example
    *
    * r.getControversial('technology').then(console.log)
    * // => Listing [
    * //  Submission { domain: 'thenextweb.com', banned_by: null, subreddit: Subreddit { display_name: 'technology' }, ... },
    * //  Submission { domain: 'pcmag.com', banned_by: null, subreddit: Subreddit { display_name: 'technology' }, ... }
    * // ]
    */
   getControversial(subredditName?: string, options?: { time: string }): Promise;

   /**
    * @summary Gets a Listing of controversial posts.
    * @param {string} [subredditName] The subreddit to get posts from. If not provided, posts are fetched from
   the front page of reddit.
    * @param {object} [options] Options for the resulting Listing
    * @returns {Promise} A Listing containing the retrieved submissions
    * @example
    *
    * r.getRising('technology').then(console.log)
    * // => Listing [
    * //  Submission { domain: 'thenextweb.com', banned_by: null, subreddit: Subreddit { display_name: 'technology' }, ... },
    * //  Submission { domain: 'pcmag.com', banned_by: null, subreddit: Subreddit { display_name: 'technology' }, ... }
    * // ]
    */
   getRising(subredditName?: string, options?: Object): Promise;

   /**
    * @summary Gets the authenticated user's unread messages.
    * @param {object} [options={}] Options for the resulting Listing
    * @returns {Promise} A Listing containing unread items in the user's inbox
    * @example
    *
    * r.getUnreadMessages().then(console.log)
    * // => Listing [
    * //  PrivateMessage { body: 'hi!', was_comment: false, first_message: null, ... },
    * //  Comment { body: 'this is a reply', link_title: 'Yay, a selfpost!', was_comment: true, ... }
    * // ]
    */
   getUnreadMessages(options?: Object): Promise;

   /**
    * @summary Gets the items in the authenticated user's inbox.
    * @param {object} [options={}] Filter options. Can also contain options for the resulting Listing.
    * @param {string} [options.filter] A filter for the inbox items. If provided, it should be one of `unread`, (unread
   items), `messages` (i.e. PMs), `comments` (comment replies), `selfreply` (selfpost replies), or `mentions` (username
   mentions).
    * @returns {Promise} A Listing containing items in the user's inbox
    * @example
    *
    * r.getInbox().then(console.log)
    * // => Listing [
    * //  PrivateMessage { body: 'hi!', was_comment: false, first_message: null, ... },
    * //  Comment { body: 'this is a reply', link_title: 'Yay, a selfpost!', was_comment: true, ... }
    * // ]
    */
   getInbox(options?: { filter: string }): Promise;

   /**
    * @summary Gets the authenticated user's modmail.
    * @param {object} [options={}] Options for the resulting Listing
    * @returns {Promise} A Listing of the user's modmail
    * @example
    *
    * r.getModmail({limit: 2}).then(console.log)
    * // => Listing [
    * //  PrivateMessage { body: '/u/not_an_aardvark has accepted an invitation to become moderator ... ', ... },
    * //  PrivateMessage { body: '/u/not_an_aardvark has been invited by /u/actually_an_aardvark to ...', ... }
    * // ]
    */
   getModmail(options?: Object): Promise;

   /**
    * @summary Gets the user's sent messages.
    * @param {object} [options={}] options for the resulting Listing
    * @returns {Promise} A Listing of the user's sent messages
    * @example
    *
    * r.getSentMessages().then(console.log)
    * // => Listing [
    * //  PrivateMessage { body: 'you have been added as an approved submitter to ...', ... },
    * //  PrivateMessage { body: 'you have been banned from posting to ...' ... }
    * // ]
    */
   getSentMessages(options?: Object): Promise;

   /**
    * @summary Marks all of the given messages as read.
    * @param {PrivateMessage[]|String[]} messages An Array of PrivateMessage or Comment objects. Can also contain strings
   representing message or comment IDs. If strings are provided, they are assumed to represent PrivateMessages unless a fullname
   prefix such as `t1_` is specified.
    * @returns {Promise} A Promise that fulfills when the request is complete
    * @example
    *
    * r.markMessagesAsRead(['51shsd', '51shxv'])
    *
    * // To reference a comment by ID, be sure to use the `t1_` prefix, otherwise snoowrap will be unable to distinguish the
    * // comment ID from a PrivateMessage ID.
    * r.markMessagesAsRead(['t5_51shsd', 't1_d3zhb5k'])
    *
    * // Alternatively, just pass in a comment object directly.
    * r.markMessagesAsRead([r.getMessage('51shsd'), r.getComment('d3zhb5k')])
    */
   markMessagesAsRead(messages: (PrivateMessage[]|String[])): Promise;

   /**
    * @summary Marks all of the given messages as unread.
    * @param {PrivateMessage[]|String[]} messages An Array of PrivateMessage or Comment objects. Can also contain strings
   representing message IDs. If strings are provided, they are assumed to represent PrivateMessages unless a fullname prefix such
   as `t1_` is included.
    * @returns {Promise} A Promise that fulfills when the request is complete
    * @example
    *
    * r.markMessagesAsUnread(['51shsd', '51shxv'])
    *
    * // To reference a comment by ID, be sure to use the `t1_` prefix, otherwise snoowrap will be unable to distinguish the
    * // comment ID from a PrivateMessage ID.
    * r.markMessagesAsUnread(['t5_51shsd', 't1_d3zhb5k'])
    *
    * // Alternatively, just pass in a comment object directly.
    * r.markMessagesAsRead([r.getMessage('51shsd'), r.getComment('d3zhb5k')])
    */
   markMessagesAsUnread(messages: (PrivateMessage[]|String[])): Promise;

   /**
    * @summary Marks all of the user's messages as read.
    * @desc **Note:** The reddit.com site imposes a ratelimit of approximately 1 request every 10 minutes on this endpoint.
   Further requests will cause the API to return a 429 error.
    * @returns {Promise} A Promise that resolves when the request is complete
    * @example
    *
    * r.readAllMessages().then(function () {
    *   r.getUnreadMessages().then(console.log)
    * })
    * // => Listing []
    * // (messages marked as 'read' on reddit)
    */
   readAllMessages(): Promise;

   /**
    * @summary Composes a new private message.
    * @param {object} options
    * @param {RedditUser|Subreddit|string} options.to The recipient of the message.
    * @param {string} options.subject The message subject (100 characters max)
    * @param {string} options.text The body of the message, in raw markdown text
    * @param {Subreddit|string} [options.fromSubreddit] If provided, the message is sent as a modmail from the specified
   subreddit.
    * @param {string} [options.captchaIden] A captcha identifier. This is only necessary if the authenticated account
   requires a captcha to submit posts and comments.
    * @param {string} [options.captchaResponse] The response to the captcha with the given identifier
    * @returns {Promise} A Promise that fulfills when the request is complete
    * @example
    *
    * r.composeMessage({
    *   to: 'actually_an_aardvark',
    *   subject: "Hi, how's it going?",
    *   text: 'Long time no see'
    * })
    * // (message created on reddit)
    */
   composeMessage(options: { to: (RedditUser|Subreddit|string), subject: string, text: string, fromSubreddit: (Subreddit|string), captchaIden: string, captchaResponse: string }): Promise;

   /**
    * @summary Gets a list of all oauth scopes supported by the reddit API.
    * @desc **Note**: This lists every single oauth scope. To get the scope of this requester, use the `scope` property instead.
    * @returns {Promise} An object containing oauth scopes.
    * @example
    *
    * r.getOauthScopeList().then(console.log)
    * // => {
    * //  creddits: {
    * //    description: 'Spend my reddit gold creddits on giving gold to other users.',
    * //    id: 'creddits',
    * //    name: 'Spend reddit gold creddits'
    * //  },
    * //  modcontributors: {
    * //    description: 'Add/remove users to approved submitter lists and ban/unban or mute/unmute users from ...',
    * //    id: 'modcontributors',
    * //    name: 'Approve submitters and ban users'
    * //  },
    * //  ...
    * // }
    */
   getOauthScopeList(): Promise;

   /**
    * @summary Conducts a search of reddit submissions.
    * @param {object} options Search options. Can also contain options for the resulting Listing.
    * @param {string} options.query The search query
    * @param {string} [options.time] Describes the timespan that posts should be retrieved from. One of
   `hour, day, week, month, year, all`
    * @param {Subreddit|string} [options.subreddit] The subreddit to conduct the search on.
    * @param {boolean} [options.restrictSr=true] Restricts search results to the given subreddit
    * @param {string} [options.sort] Determines how the results should be sorted. One of `relevance, hot, top, new, comments`
    * @param {string} [options.syntax='plain'] Specifies a syntax for the search. One of `cloudsearch, lucene, plain`
    * @returns {Promise} A Listing containing the search results.
    * @example
    *
    * r.search({
    *   query: 'Cute kittens',
    *   subreddit: 'aww',
    *   sort: 'top'
    * }).then(console.log)
    * // => Listing [
    * //  Submission { domain: 'i.imgur.com', banned_by: null, ... },
    * //  Submission { domain: 'imgur.com', banned_by: null, ... },
    * //  ...
    * // ]
    */
   search(options: { query: string, time: string, subreddit: (Subreddit|string), restrictSr: boolean, sort: string, syntax: string }): Promise;

   /**
    * @summary Searches for subreddits given a query.
    * @param {object} options
    * @param {string} options.query A search query (50 characters max)
    * @param {boolean} [options.exact=false] Determines whether the results shouldbe limited to exact matches.
    * @param {boolean} [options.includeNsfw=true] Determines whether the results should include NSFW subreddits.
    * @returns {Promise} An Array containing subreddit names
    * @example
    *
    * r.searchSubredditNames({query: 'programming'}).then(console.log)
    * // => [
    * //  'programming',
    * //  'programmingcirclejerk',
    * //  'programminghorror',
    * //  ...
    * // ]
    */
   searchSubredditNames(options: { query: string, exact: boolean, includeNsfw: boolean }): Promise;

   /**
    * @summary Creates a new subreddit.
    * @param {object} options
    * @param {string} options.name The name of the new subreddit
    * @param {string} options.title The text that should appear in the header of the subreddit
    * @param {string} options.public_description The text that appears with this subreddit on the search page, or on the
   blocked-access page if this subreddit is private. (500 characters max)
    * @param {string} options.description The sidebar text for the subreddit. (5120 characters max)
    * @param {string} [options.submit_text=''] The text to show below the submission page (1024 characters max)
    * @param {boolean} [options.hide_ads=false] Determines whether ads should be hidden on this subreddit. (This is only
   allowed for gold-only subreddits.)
    * @param {string} [options.lang='en'] The language of the subreddit (represented as an IETF language tag)
    * @param {string} [options.type='public'] Determines who should be able to access the subreddit. This should be one of
   `public, private, restricted, gold_restricted, gold_only, archived, employees_only`.
    * @param {string} [options.link_type='any'] Determines what types of submissions are allowed on the subreddit. This should
   be one of `any, link, self`.
    * @param {string} [options.submit_link_label=undefined] Custom text to display on the button that submits a link. If
   this is omitted, the default text will be displayed.
    * @param {string} [options.submit_text_label=undefined] Custom text to display on the button that submits a selfpost. If
   this is omitted, the default text will be displayed.
    * @param {string} [options.wikimode='modonly'] Determines who can edit wiki pages on the subreddit. This should be one of
   `modonly, anyone, disabled`.
    * @param {number} [options.wiki_edit_karma=0] The minimum amount of subreddit karma needed for someone to edit this
   subreddit's wiki. (This is only relevant if `options.wikimode` is set to `anyone`.)
    * @param {number} [options.wiki_edit_age=0] The minimum account age (in days) needed for someone to edit this subreddit's
   wiki. (This is only relevant if `options.wikimode` is set to `anyone`.)
    * @param {string} [options.spam_links='high'] The spam filter strength for links on this subreddit. This should be one of
   `low, high, all`.
    * @param {string} [options.spam_selfposts='high'] The spam filter strength for selfposts on this subreddit. This should be
   one of `low, high, all`.
    * @param {string} [options.spam_comments='high'] The spam filter strength for comments on this subreddit. This should be one
   of `low, high, all`.
    * @param {boolean} [options.over_18=false] Determines whether this subreddit should be classified as NSFW
    * @param {boolean} [options.allow_top=true] Determines whether the new subreddit should be able to appear in /r/all and
   trending subreddits
    * @param {boolean} [options.show_media=false] Determines whether image thumbnails should be enabled on this subreddit
    * @param {boolean} [options.exclude_banned_modqueue=false] Determines whether posts by site-wide banned users should be
   excluded from the modqueue.
    * @param {boolean} [options.public_traffic=false] Determines whether the /about/traffic page for this subreddit should be
   viewable by anyone.
    * @param {boolean} [options.collapse_deleted_comments=false] Determines whether deleted and removed comments should be
   collapsed by default
    * @param {string} [options.suggested_comment_sort=undefined] The suggested comment sort for the subreddit. This should be
   one of `confidence, top, new, controversial, old, random, qa`.If left blank, there will be no suggested sort,
   which means that users will see the sort method that is set in their own preferences (usually `confidence`.)
    * @returns {Promise} A Promise for the newly-created subreddit object.
    * @example
    *
    * r.createSubreddit({
    *   name: 'snoowrap_testing2',
    *   title: 'snoowrap testing: the sequel',
    *   public_description: 'thanks for reading the snoowrap docs!',
    *   description: 'This text will go on the sidebar',
    *   type: 'private'
    * }).then(console.log)
    * // => Subreddit { display_name: 'snoowrap_testing2' }
    * // (/r/snoowrap_testing2 created on reddit)
    */
   createSubreddit(options: { name: string, title: string, public_description: string, description: string, submit_text: string, hide_ads: boolean, lang: string, type: string, link_type: string, submit_link_label: string, submit_text_label: string, wikimode: string, wiki_edit_karma: number, wiki_edit_age: number, spam_links: string, spam_selfposts: string, spam_comments: string, over_18: boolean, allow_top: boolean, show_media: boolean, exclude_banned_modqueue: boolean, public_traffic: boolean, collapse_deleted_comments: boolean, suggested_comment_sort: string }): Promise;

   /**
    * @summary Searches subreddits by topic.
    * @param {object} options
    * @param {string} options.query The search query. (50 characters max)
    * @returns {Promise} An Array of subreddit objects corresponding to the search results
    * @example
    *
    * r.searchSubredditTopics({query: 'movies'}).then(console.log)
    * // => [
    * //  Subreddit { display_name: 'tipofmytongue' },
    * //  Subreddit { display_name: 'remove' },
    * //  Subreddit { display_name: 'horror' },
    * //  ...
    * // ]
    */
   searchSubredditTopics(options: { query: string }): Promise;

   /**
    * @summary Gets a list of subreddits that the currently-authenticated user is subscribed to.
    * @param {object} [options] Options for the resulting Listing
    * @returns {Promise} A Listing containing Subreddits
    * @example
    *
    * r.getSubscriptions({limit: 2}).then(console.log)
    * // => Listing [
    * //  Subreddit {
    * //    display_name: 'gadgets',
    * //    title: 'reddit gadget guide',
    * //    ...
    * //  },
    * //  Subreddit {
    * //    display_name: 'sports',
    * //    title: 'the sportspage of the Internet',
    * //    ...
    * //  }
    * // ]
    */
   getSubscriptions(options?: Object): Promise;

   /**
    * @summary Gets a list of subreddits in which the currently-authenticated user is an approved submitter.
    * @param {object} [options] Options for the resulting Listing
    * @returns {Promise} A Listing containing Subreddits
    * @example
    *
    * r.getContributorSubreddits().then(console.log)
    * // => Listing [
    * //  Subreddit {
    * //    display_name: 'snoowrap_testing',
    * //    title: 'snoowrap',
    * //    ...
    * //  }
    * // ]
    *
    */
   getContributorSubreddits(options?: Object): Promise;

   /**
    * @summary Gets a list of subreddits in which the currently-authenticated user is a moderator.
    * @param {object} [options] Options for the resulting Listing
    * @returns {Promise} A Listing containing Subreddits
    * @example
    *
    * r.getModeratedSubreddits().then(console.log)
    * // => Listing [
    * //  Subreddit {
    * //    display_name: 'snoowrap_testing',
    * //    title: 'snoowrap',
    * //    ...
    * //  }
    * // ]
    */
   getModeratedSubreddits(options?: Object): Promise;

   /**
    * @summary Searches subreddits by title and description.
    * @param {object} options Options for the search. May also contain Listing parameters.
    * @param {string} options.query The search query
    * @returns {Promise} A Listing containing Subreddits
    * @example
    *
    * r.searchSubreddits({query: 'cookies'}).then(console.log)
    * // => Listing [ Subreddit { ... }, Subreddit { ... }, ...]
    */
   searchSubreddits(options: { query: string }): Promise;

   /**
    * @summary Gets a list of subreddits, arranged by popularity.
    * @param {object} [options] Options for the resulting Listing
    * @returns {Promise} A Listing containing Subreddits
    * @example
    *
    * r.getPopularSubreddits().then(console.log)
    * // => Listing [ Subreddit { ... }, Subreddit { ... }, ...]
    */
   getPopularSubreddits(options?: Object): Promise;

   /**
    * @summary Gets a list of subreddits, arranged by age.
    * @param {object} [options] Options for the resulting Listing
    * @returns {Promise} A Listing containing Subreddits
    * @example
    *
    * r.getNewSubreddits().then(console.log)
    * // => Listing [ Subreddit { ... }, Subreddit { ... }, ...]
    */
   getNewSubreddits(options?: Object): Promise;

   /**
    * @summary Gets a list of gold-exclusive subreddits.
    * @param {object} [options] Options for the resulting Listing
    * @returns {Promise} A Listing containing Subreddits
    * @example
    *
    * r.getGoldSubreddits().then(console.log)
    * // => Listing [ Subreddit { ... }, Subreddit { ... }, ...]
    */
   getGoldSubreddits(options?: Object): Promise;

   /**
    * @summary Gets a list of default subreddits.
    * @param {object} [options] Options for the resulting Listing
    * @returns {Promise} A Listing containing Subreddits
    * @example
    *
    * r.getDefaultSubreddits().then(console.log)
    * // => Listing [ Subreddit { ... }, Subreddit { ... }, ...]
    */
   getDefaultSubreddits(options?: Object): Promise;

   /**
    * @summary Checks whether a given username is available for registration
    * @desc **Note:** This function will not work when snoowrap is running in a browser, due to an issue with reddit's CORS
   settings.
    * @param {string} name The username in question
    * @returns {Promise} A Promise that fulfills with a Boolean (`true` or `false`)
    * @example
    *
    * r.checkUsernameAvailability('not_an_aardvark').then(console.log)
    * // => false
    * r.checkUsernameAvailability('eqwZAr9qunx7IHqzWVeF').then(console.log)
    * // => true
    */
   checkUsernameAvailability(name: string): Promise;

   /**
    * @summary Creates a new LiveThread.
    * @param {object} options
    * @param {string} options.title The title of the livethread (100 characters max)
    * @param {string} [options.description] A descriptions of the thread. 120 characters max
    * @param {string} [options.resources] Information and useful links related to the thread. 120 characters max
    * @param {boolean} [options.nsfw=false] Determines whether the thread is Not Safe For Work
    * @returns {Promise} A Promise that fulfills with the new LiveThread when the request is complete
    * @example
    *
    * r.createLivethread({title: 'My livethread'}).then(console.log)
    * // => LiveThread { id: 'wpimncm1f01j' }
    */
   createLivethread(options: { title: string, description: string, resources: string, nsfw: boolean }): Promise;

   /**
    * @summary Gets the "happening now" LiveThread, if it exists
    * @desc This is the LiveThread that is occasionally linked at the top of reddit.com, relating to current events.
    * @returns {Promise} A Promise that fulfills with the "happening now" LiveThread if it exists, or rejects with a 404 error
   otherwise.
    * @example r.getCurrentEventsLivethread().then(thread => thread.stream.on('update', console.log))
    */
   getStickiedLivethread(): Promise;

   /**
    * @summary Gets the user's own multireddits.
    * @returns {Promise} A Promise for an Array containing the requester's MultiReddits.
    * @example
    *
    * r.getMyMultireddits().then(console.log)
    * => [ MultiReddit { ... }, MultiReddit { ... }, ... ]
    */
   getMyMultireddits(): Promise;

   /**
    * @summary Creates a new multireddit.
    * @param {object} options
    * @param {string} options.name The name of the new multireddit. 50 characters max
    * @param {string} options.description A description for the new multireddit, in markdown.
    * @param {Array} options.subreddits An Array of Subreddit objects (or subreddit names) that this multireddit should compose of
    * @param {string} [options.visibility='private'] The multireddit's visibility setting. One of `private`, `public`, `hidden`.
    * @param {string} [options.icon_name=''] One of `art and design`, `ask`, `books`, `business`, `cars`, `comics`,
   `cute animals`, `diy`, `entertainment`, `food and drink`, `funny`, `games`, `grooming`, `health`, `life advice`, `military`,
   `models pinup`, `music`, `news`, `philosophy`, `pictures and gifs`, `science`, `shopping`, `sports`, `style`, `tech`,
   `travel`, `unusual stories`, `video`, `None`
    * @param {string} [options.key_color='#000000'] A six-digit RGB hex color, preceded by '#'
    * @param {string} [options.weighting_scheme='classic'] One of `classic`, `fresh`
    * @returns {Promise} A Promise for the newly-created MultiReddit object
    * @example
    *
    * r.createMultireddit({
    *   name: 'myMulti',
    *   description: 'An example multireddit',
    *   subreddits: ['snoowrap', 'snoowrap_testing']
    * }).then(console.log)
    * => MultiReddit { display_name: 'myMulti', ... }
    */
   createMultireddit(options: { name: string, description: string, subreddits: Array, visibility: string, icon_name: string, key_color: string, weighting_scheme: string }): Promise;

   /**
    * @summary Invalidates the current access token.
    * @returns {Promise} A Promise that fulfills when this request is complete
    * @desc **Note**: This can only be used if the current requester was supplied with a `client_id` and `client_secret`. If the
   current requester was supplied with a refresh token, it will automatically create a new access token if any more requests
   are made after this one.
    * @example r.revokeAccessToken();
    */
   revokeAccessToken(): Promise;

   /**
    * @summary Invalidates the current refresh token.
    * @returns {Promise} A Promise that fulfills when this request is complete
    * @desc **Note**: This can only be used if the current requester was supplied with a `client_id` and `client_secret`. All
   access tokens generated by this refresh token will also be invalidated. This effectively de-authenticates the requester and
   prevents it from making any more valid requests. This should only be used in a few cases, e.g. if this token has
   been accidentally leaked to a third party.
    * @example r.revokeRefreshToken();
    */
   revokeRefreshToken(): Promise;

   /**
    * @summary In browsers, restores the `window.snoowrap` property to whatever it was before this instance of snoowrap was
   loaded. This is a no-op in Node.
    * @returns This instance of the snoowrap constructor
    * @example var snoowrap = window.snoowrap.noConflict();
    */
   static noConflict(): any;

}

