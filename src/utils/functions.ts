export function testData<T>(res: Response): Promise<T> {
  return res.ok ? res.json() : res.json().then(res => Promise.reject(res))
}