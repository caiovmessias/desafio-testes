import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  })

  it('should be able to authenticate user', async () => {
    const user: ICreateUserDTO = {
      email: 'user@test.com',
      password: '1234',
      name: 'User Test',
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty('token');
  });

  it('should not be able to authenticate a not exists user', () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'false@mail.com',
        password: '1234'
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('shoul not be able to authenticate with incorrect password', async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        email: 'user@test.com',
        password: 'test',
        name: 'User Test',
      });

      await authenticateUserUseCase.execute({
        email: user.email,
        password: 'testIncorrect'
      });
    }).rejects.toBeInstanceOf(AppError);


  })
})