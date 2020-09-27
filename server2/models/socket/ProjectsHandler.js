const EventMessage = require('./EventMessage');

class ProjectsHandler {
	constructor(collections, eventBus) {
		this.collections = collections;
		this.eventBus = eventBus;
	}
	async handle(message) {
		try {
			const SINGLE_PROJECTS = await this.collections[message.payload.collection].find({});
			const SINGLE_BUGS = await this.collections['Bug'].find({});

			let projects = [];

			for (let project of SINGLE_PROJECTS) {
				const bugs = SINGLE_BUGS.filter((bug) => bug.projectid == project._id);
				projects.push({
					name: project.name,
					id: String(project._id),
					created: project.created,
					createdBy: project.createdBy,
					total: bugs.length,
					critical: {
						amount: this.findAmount(bugs, 'critical'),
						percentage:0,
					},
					severe: {
						amount: this.findAmount(bugs, 'severe'),
						percentage: 0,
					},
					easy: {
						amount: this.findAmount(bugs, 'easy'),
						percentage: 0,
					},
					nth: {
						amount: this.findAmount(bugs, 'nth'),
						percentage: 0,
					},
				});
			}

			this.eventBus.next({
				...new EventMessage({ res: projects, message }),
			});
		} catch (err) {
			console.log(err);
		}
	}
	findAmount(bugs, category) {
		const bugAmount = bugs.filter((bug) => bug.category == category);
		if (!bugAmount) return 0;
		return bugAmount.length;
	}
	findAllAmounts(bugs){
		// const amount = bugs.map(bug => bugs.amount)
		// console.log(amount)
	}
}

ProjectsHandler.TYPE = 'find-all-projects';

module.exports = ProjectsHandler;
