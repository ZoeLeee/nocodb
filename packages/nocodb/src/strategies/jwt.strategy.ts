import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { User } from '~/models';
import { UsersService } from '~/services/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(options, private userService: UsersService) {
    super({
      expiresIn: '10h',
      ...options,
    });
  }

  async validate(req, jwtPayload) {
    //TODO: 目前使用默认用户信息
    // if (!jwtPayload?.email) {
    //   return jwtPayload;
    // }
  
    // const user = await User.getByEmail(jwtPayload?.email);
    const user = {
      id: 1,
      email: '133814250@qq.com',
      firstname: '管理员',
      lastname: '管理员',
      roles: {
        super: true,
        creator: true,
        'org-level-creator': true,
      },
      display_name: '管理员',
      token_version:""
    };

    // if (
    //   !user.token_version ||
    //   !jwtPayload.token_version ||
    //   user.token_version !== jwtPayload.token_version
    // ) {
    //   throw new Error('Token Expired. Please login again.');
    // }
    const userWithRoles = await User.getWithRoles(user.id, {
      user,
      baseId: req.ncBaseId,
    });

    return userWithRoles && { ...userWithRoles, isAuthorized: true };
  }
}
