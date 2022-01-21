import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Show User Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  })

  it('should be able to show user', async () => {
    const userCreated = await createUserUseCase.execute({
      name: 'User Test',
      email: 'email@test.com.br',
      password: '1234'
    });

    const user_id = userCreated.id || '';

    const user = await showUserProfileUseCase.execute(user_id);

    expect(user.id).toBe(user_id);
    expect(userCreated).toEqual(user);
  })
});
