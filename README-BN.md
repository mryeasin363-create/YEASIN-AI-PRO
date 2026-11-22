# YEASIN AI PRO — APKForge Preview Backend Fix

## কেন Failed to fetch দেখাচ্ছিল?
APKForge Preview সাধারণত HTML/JS preview করে; এটি নিজে Node.js server চালায় না। তাই AI API-র জন্য আলাদা HTTPS backend deploy করতে হবে।

## ধাপ ১: Backend deploy
1. এই project-এর `server.js`, `package.json`, `.env.example` backend hosting service-এ deploy করো (Node.js app)।
2. Build command: `npm install`
3. Start command: `npm start`
4. Hosting-এর Environment Variables-এ `OPENAI_API_KEY` যোগ করো। `.env` বা API key কখনো APKForge-এর public HTML-এ বসাবে না।
5. `ALLOWED_ORIGINS` প্রথম পরীক্ষায় `*` রাখা আছে। স্থায়ী ব্যবহারে hosting-এর CORS allowlist-এ তোমার Preview/website origin বসাও।
6. Deploy শেষে একটি HTTPS URL পাবে। সেটি browser-এ খুলে `/health` যোগ করো। JSON-এ `ok: true` দেখালে backend সচল।

## ধাপ ২: Frontend যুক্ত করা
1. APKForge-এ `public/index.html` এবং `public/config.js` ব্যবহার করো।
2. `public/config.js`-এ `API_BASE_URL`-এর জায়গায় backend-এর HTTPS URL বসাও। যেমন `https://your-backend.example.com` — শেষে `/api` লিখবে না।
3. পরিবর্তন Save করে Preview reload করো।
4. চ্যাটে একটি সাধারণ প্রশ্ন পাঠিয়ে পরীক্ষা করো।

## নিরাপত্তা
- API key শুধু backend hosting-এর secret/environment variable-এ থাকবে।
- API key HTML, JavaScript, APK, screenshot বা public repository-তে রাখবে না।
- API usage-এ খরচ হতে পারে; usage limit/budget সেট করো এবং key কারও সঙ্গে শেয়ার কোরো না।
- আগে কোনো চ্যাট বা public ফাইলে API key প্রকাশ করে থাকলে সেটি revoke করে নতুন key তৈরি করো।
- `ALLOWED_ORIGINS=*` শুধু প্রাথমিক পরীক্ষার জন্য; production-এ নির্দিষ্ট origin, authentication এবং আরও rate limiting যোগ করো।

## নোট
এই ZIP backend-এর source ও preview frontend config দেয়। এখানে থেকে hosting account-এ deploy করা হয়নি; deploy URL না পাওয়া পর্যন্ত Preview-তে AI reply কাজ করবে না।
