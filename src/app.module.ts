import { GraphQLModule } from "@nestjs/graphql";
import { Module } from "@nestjs/common";
import { AppController } from "./controllers/app.controller";
import { AppService } from "./services/app.service";
import { AuthModule } from "./resolvers/auth/auth.module";
import { UserModule } from "./resolvers/user/user.module";
import { PostModule } from "./resolvers/post/post.module";
import { AppResolver } from "./resolvers/app.resolver";
import { DateScalar } from "./common/scalars/date.scalar";
import { ConfigModule, ConfigService } from "@nestjs/config";
import config from "./configs/config";
import { GraphqlConfig } from "./configs/config.interface";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    GraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const graphqlConfig = configService.get<GraphqlConfig>("graphql");
        return {
          buildSchemaOptions: {
            numberScalarMode: "integer",
          },
          sortSchema: graphqlConfig.sortSchema,
          autoSchemaFile:
            graphqlConfig.schemaDestination || "./src/schema.graphql",
          debug: graphqlConfig.debug,
          playground: graphqlConfig.playgroundEnabled,
          context: ({ req }) => ({ req }),
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver, DateScalar],
})
export class AppModule {}
