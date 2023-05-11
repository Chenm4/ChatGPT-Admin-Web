import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
//这段代码使用了 jose 库中的 SignJWT 和 jwtVerify 方法来进行 JWT 的签名和验证。

// 其中，sign 方法接收一个 JWTPayload 对象，包含了需要保存在 JWT 中的信息，如用户 ID、权限等。
// 在 sign 方法中，使用当前时间计算了 JWT 的过期时间和生效时间，并将 JWTPayload 对象的信息设置到 SignJWT 对象中。
// 最后，使用密钥对 JWT 进行签名，生成签名后的 JWT 字符串。

// verify 方法接收一个 JWT 字符串，通过解析 JWT 中的签名和头部信息，验证 JWT 的真实性，并返回 JWTPayload 对象。如果验证失败，将会抛出异常。

// 在这段代码中，使用的是 HS256 算法进行 JWT 签名，需要提供一个密钥。
// 密钥存储在环境变量 JWT_SECRET 中，使用 TextEncoder 对象将其转换为字节数组。
// 同时，定义了一个 Payload 接口，继承自 JWTPayload，添加了一个 email 属性，表示 JWT 中需要保存的用户邮箱信息。
interface Payload extends JWTPayload {
  email: string;
}

export async function sign(payload: JWTPayload): Promise<string> {
  const iat = Math.floor(Date.now() / 1000); // Not before: Now 签发时间
  const exp = iat + 7 * 24 * (60 * 60); // Expires: Now + 1 week· 这个JWT的过期时间
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(process.env.JWT_SECRET!));
}

export async function verify(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET!)
  );
  return payload;
}
