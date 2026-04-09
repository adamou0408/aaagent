import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user.entity";

export class UserRepository {
  private repo: Repository<User>;

  constructor() {
    this.repo = AppDataSource.getRepository(User);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOneBy({ email });
  }

  findById(id: string): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }

  create(data: Partial<User>): Promise<User> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }
}
