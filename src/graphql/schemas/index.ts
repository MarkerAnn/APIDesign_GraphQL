import { gql } from 'graphql-tag'
import { foodTypeDefs } from './foodSchema'
import { nutritionTypeDefs } from './nutritionSchema'
import { ingredientTypeDefs } from './ingredientSchema'
import { sourceTypeDefs } from './sourceSchema'
import { brandTypeDefs } from './brandSchema'
import { queryTypeDefs } from './querySchema'

export const typeDefs = gql`
  ${foodTypeDefs}
  ${nutritionTypeDefs}
  ${ingredientTypeDefs}
  ${sourceTypeDefs}
  ${brandTypeDefs}
  ${queryTypeDefs}
`
