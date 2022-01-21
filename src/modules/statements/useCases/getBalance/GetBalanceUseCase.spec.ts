import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Create Statement', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  });

  it('should be able to get balance with exists user', async () => {
    const user = await createUserUseCase.execute({
      name: 'User Test',
      email: 'email@test.com',
      password: '1234'
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id || ''
    });

    expect(balance).toHaveProperty('statement');
    expect(balance).toHaveProperty('balance');
  });

  it('should not be able to get balance with non exist user', async () => {
    expect(async () => {
      const balance = await getBalanceUseCase.execute({
        user_id: 'test'
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});