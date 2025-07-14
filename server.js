import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import passport from 'passport'
import GitHubStrategy from 'passport-github2'
import session from 'express-session'
import { ref, set, onValue, push, get } from 'firebase/database'
import { db }  from './firebaseConfig.js'
import RouterEmail from './routes/routeEmail.js'
import RouteBoard from './routes/routeBoard.js'
import RouteUser from './routes/routeUser.js'
import RouteCard from './routes/routeCard.js'
import RouteTask from './routes/routeTask.js'

dotenv.config();
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
}));
app.use(express.json());

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/github/callback",
    scope: ['user:email']
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
        const dbRef = ref(db, `user/${profile.id}`);
         const snapshot = await get(dbRef);
    if (!snapshot.exists()) {
      await set(dbRef, {
        id: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        avatar: profile.photos?.[0]?.value,
        profileUrl: profile.profileUrl,
        provider: profile.provider,
        accessToken: accessToken,
        email: profile.emails?.[0]?.value || "",
        type: "github",
        createdAt: new Date().toISOString()
      });
    } else {
       await set(dbRef, {
        ...snapshot.val(),
        accessToken: accessToken,
        updatedAt: new Date().toISOString()
    });
    }
 
    } catch (error) {
        return cb(error);
    }
    return cb(null, profile);
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.use(session({
  secret: 'trello-secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('http://localhost:5173/boards');
  }
);

app.get('/api/user', async (req, res) => {
  const clientUserId = req.query.userId;

  let userId = null;

  if (clientUserId) {
    userId = clientUserId;
  } else if (req.isAuthenticated()) {
    userId = req.user.id;
  }

  if (!userId) {
    return res.status(401).json({ message: 'Không xác thực hoặc thiếu userId' });
  }

  try {
    const dbRef = ref(db, `user/${userId}`);
    const snapshot = await get(dbRef);

    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu người dùng' });
    }

    res.json(snapshot.val());
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi truy xuất Firebase', error });
  }
});

app.use('/auth', RouterEmail);
app.use('', RouteBoard);
app.use('', RouteUser);
app.use('', RouteCard);
app.use('', RouteTask);


app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:5173/login'); // 👈 quay về trang chủ frontend
  });
});

app.listen(4000, () => console.log('Express running on http://localhost:4000'));