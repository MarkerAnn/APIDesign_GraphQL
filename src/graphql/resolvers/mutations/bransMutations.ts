import { BrandService } from '../../../services/brandService'
import { requireAuth } from '../../../utils/authGuard'
import { handleError } from '../../../utils/errorHandler'
import { AuthContext } from '../../../middleware/auth'

const brandService = new BrandService()

export const brandMutations = {
  Mutation: {
    /**
     * Create a new brand
     * Requires authentication
     */
    createBrand: requireAuth(
      async (
        _: unknown,
        args: {
          input: {
            name: string
            description?: string
          }
        },
        context: AuthContext
      ) => {
        try {
          const { name, description } = args.input
          return await brandService.createBrand(name, description)
        } catch (error) {
          throw handleError(error)
        }
      }
    ),
  },
}
