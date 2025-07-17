abstract class AuthEvent {}

class LoginEvent extends AuthEvent {
  final String email;
  final String password;

  LoginEvent(this.email, this.password);
}

class RegisterEvent extends AuthEvent {
  final String email;
  final String password;
  final String firstName;
  final String lastName;

  RegisterEvent(this.email, this.password, this.firstName, this.lastName);
}
