import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase"
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let createStatementUseCase: CreateStatementUseCase;
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
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it('should be able to create a new statement', async () => {
    const user = await createUserUseCase.execute({
      name: 'User Test',
      email: 'email@test.com',
      password: '1234'
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id || '',
      amount: 100,
      description: 'Test',
      type: 'deposit' as OperationType
    });

    expect(statement).toHaveProperty('id');
  });

  it('should not be able to create a statement if user not exists', () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: 'test',
        amount: 100,
        description: 'Test',
        type: 'deposit' as OperationType
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a withdray a insufficient Funds', () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: 'User Test',
        email: 'email@test.com',
        password: '1234'
      });
  
      const statement = await createStatementUseCase.execute({
        user_id: user.id || '',
        amount: 100,
        description: 'Test',
        type: 'withdraw' as OperationType
      });
    }).rejects.toBeInstanceOf(AppError);
  })
})