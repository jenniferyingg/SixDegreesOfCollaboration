class Queue<T> {
  public array: T[] = [];

  append(data: T): void {
    this.array.push(data);
  }

  pop(): T | undefined {
    return this.array.shift();
  }

  peek(): T {
    return this.array[0];
  }
  
  isEmpty(): boolean {
    return this.array.length === 0;
  }
}

export default Queue;