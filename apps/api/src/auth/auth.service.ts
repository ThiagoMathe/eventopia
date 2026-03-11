import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: any) {
    // 1. Verificar se o e-mail já existe
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExists) throw new BadRequestException('E-mail já cadastrado');

    // 2. Hashear a senha
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Salvar no banco
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: dto.role || 'USER',
      },
    });

    // 4. Retornar o token
    return this.generateToken(user.id, user.email, user.role);
  }

  async signIn(dto: any) {
    // Busca o usuário pelo e-mail
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Se o usuário não existir ou a senha não bater, erro de "Não Autorizado"
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Se passou, gera o token
    return this.generateToken(user.id, user.email, user.role);
  }

  private generateToken(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}