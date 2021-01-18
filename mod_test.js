import { assertEquals } from './deps_test.js'
import { and, or, Validation, Success, Fail, validate } from './mod.js'
const { test } = Deno

const isPresent = Validation(
  (k,v) => !!v ? Success(v) : Fail([`${k} needs to be present`])
)

const isEmail = Validation(
  (k, v) => /@/.test(v) ? Success(v) : Fail([`${k} should be email`])
)

const spec = {
  name: isPresent,
  email: and(isEmail, isPresent),
  description: or(isPresent, isEmail)
}

test('happy path', () => 
  validate(spec, { name: 'Tom', email: 'tom@email.com', description: ''})
    .fold(
      e => assertEquals(false, false),
      r => {
        console.log(r)
        assertEquals(true, true)
      }
    )
)

test('sad path', () => 
  validate(spec, { name: '', email: '', description: ''})
    .fold(
      e => {
        console.log(e)
        assertEquals(true, true)
      },
      r => assertEquals(false, false)
    )
)
