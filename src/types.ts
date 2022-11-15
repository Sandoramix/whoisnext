export type ListItem = {
	peopleIndex: number,
	title: string,
	people: Person[]
}
export type Person = {
	id: number,
	name: string,
	isCompleted: boolean
}