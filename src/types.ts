export type List = {
	id: string,
	peopleIndex: number,
	title: string,
	people: Person[]
}
export type Person = {
	id: number,
	name: string,
	isCompleted: boolean
}