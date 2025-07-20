package com.bookinghomestay.app.application.auth.command;

import com.bookinghomestay.app.domain.exception.UnauthorizedException;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.infrastructure.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginUserCommandHandler {

    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public LoginUserCommandHandler(IUserRepository userRepository,
                                   PasswordEncoder passwordEncoder,
                                   JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public String handle(LoginUserCommand command) {
        User user = userRepository.findByEmail(command.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Không tìm thấy tài khoản !"));

        if (!passwordEncoder.matches(command.getPassword(), user.getPassWord())) {
            throw new UnauthorizedException("Sai tên đăng nhập hoặc mật khẩu !");
        }

        return jwtTokenProvider.generateToken(user.getUserName(), user.getRole().getRoleName());
    }
}
