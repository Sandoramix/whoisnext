import { type List } from "../types";

export function getPeopleFromList(list: List, onlyIncomplete = true) {
	return !onlyIncomplete ? list.people : list.people.filter(person => !person.isCompleted)
}

export function getPeopleCount(list: List, onlyIncomplete = true) {
	return !onlyIncomplete ? list.people.length : list.people.filter(person => !person.isCompleted).length;
}