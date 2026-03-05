import { Router } from 'express';
import { successResponse } from '../../common/utils/index.js';
import { signup, login, signupWithGmail, verifyEmail } from './auth.service.js';

const router = Router();
router.post("/signup", async (req, res, next) => {
  const account = await signup(req.body)
  return successResponse({ res, status: 201, data: { account } })
})

router.post("/login", async (req, res, next) => {
  //http://127.0.0.1:3000
  //https://127.0.0.1:3000
  console.log(`${req.protocol}://${req.host}`);

  const credentials = await login(req.body, `${req.protocol}://${req.host}`)
  return successResponse({ res, data: { credentials } })
})

router.post("/verify-email", async (req, res, next) => {
    try {
        const result = await verifyEmail(req.body);
        return successResponse({ 
            res, 
            message: "Email verified successfully", 
            data: result 
        });
    } catch (error) {
        next(error); 
    }
});
router.post("/signup/gmail", async (req, res, next) => {
    try {
        const { idToken } = req.body;
        
        console.log("Token received in Controller:", idToken);

        const result = await signupWithGmail(idToken, `${req.protocol}://${req.get('host')}`);
        
        const { status, Credential } = result;
        return successResponse({ res, status, data: { ...Credential } });
    } catch (error) {
        next(error); 
    }
});

export default router
