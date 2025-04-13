import jwt, { JwtPayload } from "jsonwebtoken"

import { SignOptions } from "jsonwebtoken";

const DEFAULT_SIGN_OPTION: SignOptions = {};

/**
 *  Sign a JWT token with the given payload and options.
 *  @param payload - The payload to sign.
 *  @param option - The options to sign the token.
 *  @returns The signed JWT token.
 */
export function signToken(payload: JwtPayload, option: SignOptions = DEFAULT_SIGN_OPTION) {
    const secretKey = process.env.JWT_SECRET_KEY
    const token = jwt.sign(payload, secretKey as string, option)
    return token
}

/**
 *  Verify a JWT token and return the decoded payload.
 *  @param token - The JWT token to verify.
 *  @returns The decoded payload or null if verification fails.
 */
export function verifyToken(token: string) {
    try {
        const secretKey = process.env.JWT_SECRET_KEY
        const decoded = jwt.verify(token, secretKey as string)
        return decoded as JwtPayload
    } catch (error) {
        console.error("JWT Error: ", error)
        return null
    }
}