import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let getBalanceOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
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
    getBalanceOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it('should be able to get balance operation with exists user', async () => {
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

    const operation = await getBalanceOperationUseCase.execute({
      user_id: user.id || '',
      statement_id: statement.id || ''
    });

    expect(operation).toHaveProperty('id');
    expect(operation.user_id).toBe(user.id);
    expect(operation.type).toBe('deposit');
  });

  it('should not be able to get operation with non exist user', async () => {
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
        type: 'deposit' as OperationType
      });
      
      await getBalanceOperationUseCase.execute({
        user_id: 'test',
        statement_id: statement.id || ''
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to get operation with non exist operation', async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: 'User Test',
        email: 'email@test.com',
        password: '1234'
      });
      
      await createStatementUseCase.execute({
        user_id: user.id || '',
        amount: 100,
        description: 'Test',
        type: 'deposit' as OperationType
      });
      
      await getBalanceOperationUseCase.execute({
        user_id: user.id || '',
        statement_id: 'test'
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});