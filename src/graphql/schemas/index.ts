import { gql } from 'graphql-tag'
import { foodTypeDefs } from './foodSchema.js'
import { nutritionTypeDefs } from './nutritionSchema.js'
import { ingredientTypeDefs } from './ingredientSchema.js'
import { sourceTypeDefs } from './sourceSchema.js'
import { brandTypeDefs } from './brandSchema.js'
import { queryTypeDefs } from './querySchema.js'
import { mutationTypeDefs } from './mutationSchema.js'
import { inputTypeDefs } from './inputSchema.js'
import { userTypeDefs } from './user.js'

export const typeDefs = gql`
  ${foodTypeDefs}
  ${nutritionTypeDefs}
  ${ingredientTypeDefs}
  ${sourceTypeDefs}
  ${brandTypeDefs}
  ${queryTypeDefs}
  ${mutationTypeDefs}
  ${inputTypeDefs}
  ${userTypeDefs}
`
