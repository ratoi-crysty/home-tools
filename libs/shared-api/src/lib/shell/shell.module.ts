import { Global, Module } from '@nestjs/common';
import { ShellService } from './shell.service';

@Global()
@Module({
  providers: [ShellService],
  exports: [ShellService],
})
export class ShellModule {}
