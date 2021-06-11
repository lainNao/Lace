import { RelatedCellsRepositoryJson } from "../renderer/repositories/RelatedCellsRepositoryJson"
import { initializeApplicationUsecase } from "../renderer/usecases/initializeApplicationUsecase"
import { sum } from "./sample"

describe("sample test", () => {
  it("should be 3 when inputs are 1, 2 ", async () => {
    // console.time('test');

    const actual = sum(1, 2)
    expect(actual).toBe(3)

    // console.timeEnd('test');
  })

  it("should something work", async () => {
    // console.log(initializeApplicationUsecase)  //localStorageのエラーとなる
    expect(1).toBe(1)
  })

})
