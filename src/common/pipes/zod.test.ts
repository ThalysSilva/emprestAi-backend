import { z } from 'zod';
import { ZodValidationPipe } from './zod';
import { BadRequestError } from '../applicationError';

describe('ZodValidationPipe', () => {
  it('should validate a valid object', async () => {
    const schema = z.object({
      name: z.string(),
      email: z.string().email(),
    });

    const pipeInstance = new ZodValidationPipe(schema);
    const value = { name: 'John Doe', email: 'johndoe@example.com' };

    const result = pipeInstance.transform(value, { type: 'body' });
    expect(result).toEqual(value);
  });

  it('should throw an error for an invalid object', async () => {
    const schema = z.object({
      name: z.string(),
      email: z.string().email(),
    });

    const pipeInstance = new ZodValidationPipe(schema);
    const value = { name: 'John Doe', email: 'invalid-email' };

    try {
      await pipeInstance.transform(value, { type: 'body' });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.message).toContain('Invalid email');
    }
  });

  it('should not validate non-body requests', async () => {
    const schema = z.object({
      name: z.string(),
      email: z.string().email(),
    });

    const pipeInstance = new ZodValidationPipe(schema);
    const value = { name: 'John Doe', email: 'invalid-email' };

    const result = pipeInstance.transform(value, { type: 'query' });
    expect(result).toEqual(value);
  });
});
