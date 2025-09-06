import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'name debe ser texto.' })
  @MinLength(2, { message: 'name debe tener al menos 2 caracteres.' })
  name: string;

  @IsString({ message: 'lastName debe ser texto.' })
  @MinLength(2, { message: 'lastName debe tener al menos 2 caracteres.' })
  lastName: string;

  @IsEmail({}, { message: 'email debe tener formato válido.' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'password debe tener al menos 8 caracteres.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, { message: 'password debe incluir letras y números.' })
  password: string;
}
