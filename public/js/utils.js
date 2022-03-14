import { STATUS, PRIORITIES } from "./constants";

const getPriorityLabel = (priority) => {
    // When priority is undefined, set Low
    const id = !priority ? 4 : +priority;
    const priorityIndex = PRIORITIES.findIndex(p => p.value === id);
    return PRIORITIES[priorityIndex].label
}

module.exports = { getPriorityLabel };

