import React from 'react'

import { Iterable, IterableItem } from '~components/Iterable'
import { Algorithm } from '~components/Algorithm'
import { Pointer } from '~components/Pointer'
import { useAlgorithm } from '~lib/useAlgorithm'
import { addIds } from '~utils/helpers'

const input = [-3, 0, 1, 2, -1, 1, -2]

export default function TripleSumToZero() {
  const context = useAlgorithm(findTriples, { arr: input })

  const { state } = context.models
  const { done, active, curr, head, tail, result } = state

  const isActive = (index) =>
    done || active || [curr, head, tail].includes(index)
  const showPointer = (index) => !done && !active && isActive(index)

  return (
    <Algorithm
      title="Triplet Sum to Zero"
      pattern="Two Pointers"
      context={context}
    >
      <section>
        <Iterable>
          {state.input.map((item, index) => (
            <IterableItem
              key={item.id}
              animate={isActive(index) ? 'active' : 'inactive'}
              className={['rounded-md mr-2', { result: done }]}
            >
              {item.val}
              {showPointer(index) && <Pointer />}
            </IterableItem>
          ))}
        </Iterable>
      </section>
      {result && result.length > 0 && (
        <section className="mt-8">
          <code className="block">{JSON.stringify(result, null, 1)}</code>
        </section>
      )}
    </Algorithm>
  )
}

export function findTriples({ record }, { arr }) {
  const nums = addIds(arr)

  record({ input: [...nums], active: true })
  nums.sort((a, b) => a.val - b.val)
  record({ input: nums, active: true })

  const result = []
  for (let i = 0; i < nums.length - 2; i++) {
    const target = nums[i].val
    record({
      input: nums,
      curr: i,
      result: [...result],
    })
    if (i > 0 && target === nums[i - 1]) {
      continue
    }
    const pairs = findAllPairsWithSum(
      {
        record: (data) =>
          record({ ...data, input: nums, curr: i, result: [...result] }),
      },
      { nums, target: -target, head: i + 1 }
    )
    if (pairs) {
      for (const [head, tail] of pairs) {
        result.push([target, nums[head].val, nums[tail].val])
      }
    }
  }
  record({ done: true, input: nums, result: [...result] })
}

function findAllPairsWithSum({ record }, { nums, target, head }) {
  let tail = nums.length - 1
  const result = []

  while (head < tail) {
    const headNum = nums[head].val
    const tailNum = nums[tail].val

    record({
      head,
      tail,
      done: false,
    })

    if (headNum + tailNum === target) {
      result.push([head, tail])
      head++
      tail--
    } else if (headNum + tailNum > target) {
      tail--
    } else {
      head++
    }
  }

  return result
}
