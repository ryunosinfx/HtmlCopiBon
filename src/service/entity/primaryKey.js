import { BaseEntity } from './baseEntity.js';
const DELIMITER = '-';
export class PrimaryKey {
	constructor(pk) {
		this.pk = pk;
	}

	static getDelimiter() {
		return '-';
	}

	static assemblePK(entity, number) {
		return entity.getEntityName() + DELIMITER + number;
	}
	static isPrimaryKey(value) {
		return value && typeof value === 'string' && value.split(DELIMITER).length === 2;
	}

	static getPrimaryKey(value) {
		if (value) {
			if (PrimaryKey.isPrimaryKey(value)) {
				return value;
			} else if (value.getEntityName && value.getPk) {
				return value.getPk();
			} else if (value.oid) {
				return value.oid;
			} else if (value.pk) {
				return value.pk;
			}
			return null;
		} else {
			return value;
		}
	}
	static getEntityName(pk) {
		return PrimaryKey.getPrimaryKey(pk).split(DELIMITER)[0];
	}
}
