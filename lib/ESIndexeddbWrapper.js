const M_R = 'readonly',
	M_RW = 'readwrite',
	cSAll = 'cmdSelectAll',
	cSByKey = 'cmdSelectByKey',
	cSByKeys = 'cmdSelectByKeys',
	cSF1 = 'cmdSelectFirstOne',
	cBulkIU = 'cmdBulkInsertUpdate',
	cIU = 'cmdInsertUpdate',
	cDelWithRng = 'cmdDeleteWithRange',
	cDel = 'cmdDelete',
	cTrunc = 'cmdTruncate',
	cCreateOB = 'cmdCreateStore',
	cDelOB = 'cmdDeleteStore',
	cCreateIdx = 'cmdCreateIndex',
	cDelIdx = 'cmdDeleteIndex',
	cGetOBN = 'cmdGetObjectStoreNames',
	N = null,
	PFX = '_',
	Js = (a) => JSON.stringify(a),
	w = (...a) => console.warn(a) || console.trace(),
	io = (...a) => console.info(a),
	err = (...a) => console.error(a),
	pr = (f) => new Promise(f),
	now = () => Date.now(),
	isArr = (a) => Array.isArray(a),
	ct = (t) => clearTimeout(t),
	st = (f, w = 0) => setTimeout(f, w),
	ef = (e, j = () => {}, id = '', l = N) => {
		w(`${id} ${e.message}`);
		w(e.stack);
		if (l && l.log && l !== console) {
			l.log(`${id} ${e.message}`);
			l.log(e.stack);
		}
		j(e);
	},
	oR = (r, v, j, rslt) => {
		r.onsuccess = (e) => v(!io(e) && rslt ? rslt : r.result);
		r.onerror = (e) => ef(e, j);
	},
	gD = (d) => (d === N || d === void 0 ? N : d.data),
	cb = async () => {},
	mkR = (d, kpn, k) => {
		const r = {
			data: d,
		};
		r[kpn] = k;
		return r;
	},
	slp = (s = 100) => pr((r) => st(() => r(), s));
function tE(m, j = cb) {
	return (e) => {
		ef(e, j);
		err(m ? m : `/${e}`);
		throw new Error(e);
	};
}
export class idbw {
	static ua = navigator.userAgent.replace(/[.0-9]+/g, 'x');
	static kpn = 'pk';
	static cnst = {
		sysDbName: 'IDBWrapperSys',
		cacheObName: 'cacheTimes',
		dbName: 'IDBWrapper',
		ua: idbw.ua,
		domain: window.location,
		kpn: idbw.kpn,
	};
	static sysDBN = idbw.cnst.sysDbName;
	static CDBNa = idbw.cnst.cacheObName;
	static kpnA = idbw.cnst.kpn;
	static crrntDBN = idbw.cnst.dbName;

	constructor(d = idbw.crrntDBN) {
		this.dbn = d;
	}
	async getAccessor(tn = idbw.crrntDBN, kpn = idbw.kpnA) {
		return await IA.gi(tn, kpn, this.dbn);
	}
}
class IA {
	#i = N;
	static hM = new Map();
	static aM = new Map();
	static dbName = idbw.cnst.dbName;
	static SBBA = N;
	constructor(tn, kpn = idbw.cnst.kpn, isAI = 0, cObN = IA.dbName, l = console) {
		const z = this;
		if (!IA.hM.has(cObN)) {
			z.#i = new IH(cObN);
			IA.hM.set(cObN, z.#i);
		} else z.#i = IA.hM.get(cObN);
		z.kpn = kpn;
		z.tn = tn;
		z.isAI = isAI;
		z.l = l;
	}
	static sDBN(d) {
		IA.dbName = d;
	}
	static async gi(tn, kpN, cdbn = IA.dbName, isAI = 0, isC = 1) {
		const k = Js([cdbn, tn]);
		if (IA.aM.has(k)) return IA.aM.get(k);
		if (!IA.SBBA) IA.SBBA = await IA.mki(idbw.CDBNa, idbw.kpn, 0, idbw.sysDBN, 0);
		return await IA.mki(tn, kpN, isAI, cdbn, isC, k);
	}
	static async mki(tn, kpn, isAI = 0, cdbn = IA.dbName, isC = 1, k) {
		const i = new IA(tn, kpn, isAI, cdbn);
		io((await i.i(isC)) && k ? IA.aM.set(k, i) : 1);
		return i;
	}
	i(isC = 1) {
		const z = this; // init
		z.isC = isC;
		return pr(async (v, j) => {
			// console.log('IA.i');
			await z.#i.i();
			await z.#i.cOS(z.tn, z.kpn, z.isAI).catch(tE('IdbA.init', j));
			v(1);
		});
	}
	async dump() {
		return {};
	}
	async restore(dumpData) {
		io(dumpData);
		return;
	}
	async putByMap(dM, cb) {
		const z = this;
		for (const k in dM) await z.#i.iu(z.tn, z.kpn, mkR(dM[k], z.kpn, k), cb, 1);
	}
	put(k, d, cb) {
		const z = this;
		return z.#i.iu(z.tn, z.kpn, mkR(d, z.kpn, k), cb, z.isC);
	}
	getAsMap(ks) {
		return isArr(ks) ? this.#i.slctByKs(this.tn, ks, this.isC) : N;
	}
	getRecord(k) {
		return k ? this.#i.sByKey(this.tn, k, this.isC) : N;
	}
	async get(k) {
		return gD(await this.getRecord(k));
	}
	getAll() {
		return this.#i.slctAll(this.tn, this.isC);
	}
	delete(k) {
		return k ? this.#i.del(this.tn, k, this.isC) : N;
	}
	truncate() {
		return this.#i.truncate(this.tn, this.isC);
	}
	getOsNames() {
		return this.#i.getObjectStoreNames();
	}
}
class IH {
	constructor(d) {
		const z = this;
		z.dbn = d;
		z.co = IC.gI(d);
		z.qu = [];
		z.lltMode = N;
		z.lastLockTime = now();
		z.c = 0;
		z.isWC = 1;
	}
	async i() {
		// console.log('IH i');
		this.CM = await IOM.gi(this.dbn);
	}
	beWC(isWC = 1) {
		this.isWC = isWC;
	}
	async dQ() {
		const z = this;
		if (z.c < 1) {
			z.c++;
			if (z.c > 1) {
				z.c--;
				st(() => z.dQ());
			} else {
				await z.dQE();
				z.c--;
				if (z.c < 1 && z.qu.length > 0) z.dQ();
			}
		}
	}
	dQE() {
		return pr(async (v) => {
			const z = this,
				q = z.qu; //queue
			while (q.length > 0) {
				// console.log('dQE q.length :' + q.length);
				const p = [], //process
					st = [];
				while (q.length > 0) {
					const t = q.shift();
					if (!t) continue;
					if (z.lltMode !== t.mode || t.mode === M_RW) {
						if (p.length > 0) {
							// console.log('dQE A p.length :' + p.length, p);
							const r = await Promise.all(p).catch(ef); //RW
							// console.log('dQE A r :', r);
							for (const i in r) st[i].rv(r[i]);
							p.splice(0, p.length);
						}
						await z.excUpT(t, v);
					} else {
						p.push(z.eC(t.cmd, t.data)); //R
						st.push(t);
					}
					z.lltMode = t.mode;
				}
				if (p.length > 0) {
					// console.log('dQE B p.length :' + p.length, p);
					const r = await Promise.all(p).catch(ef);
					for (const i in r) st[i].rv(r[i]);
					// console.log('dQE B r :', r);
					p.splice(0, p.length);
					v();
				}
			}
		});
	}
	async excUpT(t, rv) {
		const d = await this.eC(t.cmd, t.data);
		t.rv(d);
		rv(d);
	}
	q(c, d) {
		return this.eQ(c, d, M_R);
	}
	u(c, d) {
		return this.eQ(c, d, M_RW);
	}
	eQ(c, d, m) {
		return pr((rv, rj) => cb(this.qu.push({ cmd: c, data: d, rv, rj, mode: m }), this.dQ())); //enQueue
	}
	async gC(tn, m, d, cbf = cb, isC) {
		if (!isC) return await cbf();
		const k = Js([m, d]),
			c = await this.CM.getC(tn, k);
		if (c) return c;
		const r = await cbf();
		this.CM.uC(tn, k, r);
		return r;
	}
	cc(tn, isC) {
		return isC ? this.CM.trancC(tn) : N;
	}
	eC(c, d) {
		// console.log('ec c:' + c, d);
		const z = this,
			o = z.co,
			tn = d.tn,
			rng = d.rng,
			kpn = d.kpn,
			drct = d.drct,
			cons = d.cons,
			keys = d.keys,
			key = d.key,
			isC = d.isC;
		if (cSAll === c) return z.gC(tn, c, d, () => o.sAll({ tn, rng, drct, ofst: d.offset, cnt: d.lc }, d.cb), isC);
		if (cSByKey === c) return z.gC(tn, c, d, () => o.sByK({ tn, key }), isC);
		if (cSByKeys === c) return z.gC(tn, c, d, () => o.slctByKs({ tn, keys }), isC);
		if (cSF1 === c) return z.gC(tn, c, d, () => o.sF1({ tn, rng, drct }), isC);
		if (cBulkIU === c) return cb(z.cc(tn, isC), o.bulkIU(tn, kpn, d.data, d.cb));
		if (cIU === c) return cb(z.cc(tn, isC), o.IU(tn, kpn, d.data, d.cb));
		if (cDelWithRng === c) return cb(z.cc(tn, isC), o.delWithRng({ tn, rng, cons }));
		if (cDel === c) return cb(z.cc(tn, isC), o.del(tn, d.kpv));
		if (cTrunc === c) return cb(z.CM.trancC(tn), o.truncate({ tn }));
		if (cCreateOB === c) return o.cs({ tn, kpn, isAI: d.isAI });
		if (cDelOB === c) return cb(z.CM.cc(), o.ds(tn));
		if (cCreateIdx === c) return o.cIdx(tn, kpn, d.isMultiColumns);
		if (cDelIdx === c) return o.di(tn, d.idxN);
		if (cGetOBN === c) return o.getOBN();
	}
	slctAllFM(tn, k, drct, ofst, lc, isC = 1) {
		const n = k.slice(0, -1) + String.fromCharCode(k.slice(-1).charCodeAt() + 1);
		return this.slctAll(tn, IDBKeyRange.bound(k, n, false, true), drct, ofst, lc, isC);
	}
	slctAll(tn, rng, drct, ofst, lc, isC = 1) {
		return this.q(cSAll, {
			tn, //selectall
			rng,
			drct,
			ofst,
			lc,
			isC,
		});
	}
	sByKey(tn, k, isC = 1) {
		return this.q(cSByKey, { tn, key: k, isC });
	}
	sByKeys(tn, ks, isC = 1) {
		return this.q(cSByKeys, { tn, keys: ks, isC });
	}
	sF1(tn, r, drct, isC = 1) {
		return this.q(cSF1, { tn, rng: r, drct, isC });
	}
	bulkIU(tn, kpn, d, cb, isC = 1) {
		return this.u(cBulkIU, {
			tn,
			kpn,
			data: d,
			cb,
			isC,
		});
	}
	iu(tn, kpn, d, cb, isC = 1) {
		return this.u(cIU, { tn, kpn, data: d, cb, isC });
	}
	delWithRange(tn, r, drct, isC = 1) {
		return this.u(cDelWithRng, { tn, rng: r, drct, isC });
	}
	del(tn, kpn, isC = 1) {
		return this.u(cDel, { tn, kpv: kpn, isC });
	}
	truncate(tn, isC = 1) {
		return this.u(cTrunc, { tn, isC });
	}
	cOS(tn, kpn, isAI, isC = 1) {
		return this.u(cCreateOB, { tn, kpn, isAI, isC });
	}
	delOB(tn, isC = 1) {
		return this.u(cDelOB, { tn, isC });
	}
	creatIdx(tn, kpn, isMultiColumns) {
		return this.u(cCreateIdx, { tn, kpn, isMultiColumns });
	}
	delIdx(tn, idxN) {
		return this.u(cDelIdx, { tn, idxN });
	}
	getOBNs() {
		return this.q(cGetOBN, {});
	}
}
class IC {
	static lockM = new Map();
	constructor(d) {
		const z = this;
		z.idb = window.indexedDB;
		z.dbn = d;
		z.kpM = {};
		z.db = N;
		z.lastVer = N;
		z.isRWO = 0;
		z.t = N;
		z.isDBC = 1; //isdbClose
		z.id = Math.floor(Math.random() * 100000) + '_' + Date.now();
	}
	static gI(dbn) {
		const i = IC.lockM.get(dbn);
		if (i) return i;
		const j = new IC(dbn);
		IC.lockM.set(dbn, j);
		return j;
	}
	oDB(nv) {
		const z = this;
		// console.log('oDB A dbn:' + z.dbn + '/nv:' + nv + '/id:' + z.id);
		return pr(async (v, j) => {
			z.lastVer = nv;
			// console.log('oDB B dbn:' + z.dbn + '/z.db:' + z.db + '/id:' + z.id);
			if (z.lastVer && z.db) {
				// console.log('oDB C dbn:' + z.dbn + '/close!!!!!!!!!!!!!!!!!!!!!!!! nv:' + nv + '/id:' + z.id);
				const a = z.db.close();
				IC.beCDB(z, v);
				await slp(100);
				// console.log('oDB D dbn:' + z.dbn + '/id:' + z.id + '/close a:', a);
				z.isRWO = 1;
			} else if (z.db && z.isDBC === 0) return v(z.db);
			else z.isRWO = z.lastVer ? 1 : 0;
			const f = (e) => {
				// console.log('####oDB dbn:' + z.dbn + '/id:' + z.id + '/f tyep:' + e.type + 'e:', e);
				z.db = e.target.result;
				z.isDBC = 0;
				v(z.db);
			};
			const r = z.idb.open(z.dbn, nv);
			// console.log('oDB E dbn:' + z.dbn + '/id:' + z.id + '/r:', r);
			r.onsuccess = f;
			r.onupgradeneeded = f;
			r.onblocked = f;
			r.onabort = (e) => ef(e, v);
			r.onerror = (e) => ef(e, j);
			// console.log('oDB F dbn:' + z.dbn + '/id:' + z.id + '/r:', r);
		});
	}
	cDB(v) {
		// console.log('closeDB A v:' + v);
		const z = this;
		if (z.isRWO) return IC.beCDB(z, v);
		// console.log('closeDB B v:' + v);
		ct(z.t);
		z.t = st(() => IC.beCDB(z), 1000);
		return v;
	}
	static beCDB(z, v) {
		z.db.close();
		z.isDBC = 1;
		return v;
	}
	gOS(db, tn, m, ts) {
		const t = db.transaction(isArr(ts) ? ts : [tn], m),
			f = (e) => this.cDB(io(e));
		t.oncomplete = f;
		t.onerror = f;
		return t.objectStore(tn); //getObjectStore
	}
	getKPbyM(tn) {
		return this.kpM[tn];
	}
	async getKP(tn) {
		const z = this,
			kpn = z.getKPbyM(tn);
		if (kpn) return kpn;
		const os = z.gOS(await z.oDB().catch(tE('getKP->oDB')), tn, M_R),
			k = os.keyPath;
		z.kpM[tn] = k;
		return z.cDB(k);
	}
	async getV() {
		// console.log('getV A:');
		const a = await this.oDB().catch(tE('getV->oDB'));
		// console.log('getV B a:', a);
		return this.cDB(a.version);
	}
	async sAll(p, cbc = cb) {
		// console.log('sAll A p:', p);
		const z = this,
			ob = z.gOS(await z.oDB().catch(tE(`sAll->oDB tn:${p.tn}`)), p.tn, M_R);
		// console.log('sAll C ob:', ob);
		return await z.sAllE(ob, p.rng, 0, p.ofst, p.cnt, cbc);
	}
	sAllE(ob, d, isGetF1, ofst, cnt, cb) {
		return pr((v, j) => {
			const isValidCB = typeof ofst === 'function',
				isOnLimit = typeof ofst === 'number' && typeof cnt === 'number' && ofst > 0 && cnt > 0,
				endC = isValidCB ? cnt : ofst + cnt,
				l = [],
				r = ob.openCursor(d ? d : void 0);
			let rC = 0;
			r.onsuccess = (e) => {
				const c = e.target.result;
				if (c) {
					const v = c.value;
					if (isValidCB && !cb(v)) return c.continue();
					if (isOnLimit)
						if (ofst > rC) return c.continue(void 0, rC++);
						else if (endC < rC) return v(l);
					l.push(v);
					if (isGetF1) return v(l[0]);
					rC++;
					c.continue();
				} else v(l);
			};
			r.onerror = (e) => ef(e, j);
		});
	}
	async sByK(p) {
		return await this.sByKoT(await this.oDB().catch(tE(`sByK->oDB tn:${p.tn}`)), p.tn, p.key).catch(
			tE(`sByK->sByKoT tn:${p.tn}/mode:${M_R}`)
		);
	}
	sByKoT(db, tn, k, m = M_R) {
		return this.getR(this.gOS(db, tn, m), k);
	}
	getR(ob, k) {
		return pr((v, j) => cb(!k ? v(N) : k, oR(ob.get(k), v, j)));
	}
	async slctByKs(p) {
		return await this.sByKsoT(await this.oDB().catch(tE(`sByKs->oDB tn:${p.tn}`)), p.tn, p.keys).catch(
			tE(`sByKs->sByKsoT tn:${p.tn}`)
		);
	}
	sByKsoT(db, tn, ks) {
		return this.sByKsoTE(this.gOS(db, tn, M_R), ks, tn);
	}
	async sByKsoTE(os, ks) {
		const m = {};
		for (const k of ks) m[k] = await this.getR(os, k);
		return m;
	}
	async sF1(p) {
		return await this.sAllE(
			this.gOS(await this.oDB().catch(tE(`sF1->oDB tn:${p.tn}/drct:${p.drct}`)), p.tn, M_R),
			p.rng,
			true
		);
	}
	async bulkIU(tn, kpn, d, cbc = cb) {
		const dl = [],
			ks = [];
		for (const r of d) {
			const k = r[kpn];
			cb(dl.push({ k, r }), ks.push(k));
		}
		const o = this.gOS(await this.oDB().catch(tE(`bulkIU->oDB tn:${tn}`)), tn, M_RW),
			dM = await this.sByKsoTE(o, ks, tn),
			p = [],
			q = [];
		let a;
		for (const { k, r } of dl) a = dM[k] ? p.push(this.put(o, k, r)) : q.push(this.add(o, k, r));
		await Promise.all(p);
		await Promise.all(q);
		cbc(a);
	}
	add(ob, k, r) {
		return pr((v, j) => oR(ob.add(r), v, j, { r, k }));
	}
	put(ob, k, r) {
		return pr((v, j) => oR(ob.put(r), v, j, { r, k }));
	}
	async IU(tn, kpn, d, cbc = cb) {
		const z = this,
			k = d[kpn],
			db = await z.oDB().catch(tE(`IU->oDB tn:${tn}`)),
			v = await z.sByKoT(db, tn, k, M_RW).catch(tE(`IU->sByKoT tn:${tn}/MODE_RW`));
		cbc(v, d);
		const ob = z.gOS(db, tn, M_RW);
		// console.log('IU v:' + v + '/k:' + k + '/d:', d, ob);
		return await (v === void 0 ? z.add(ob, k, d) : z.put(ob, k, d)).catch(tE(`IU->add/put tn:${tn}`));
	}
	async delWithRng(p) {
		return await this.delWRExe(await this.oDB().catch(tE(`delWithRng->oDB tn:${p.tn}`)), p.tn, p.rng, p.cos);
	}
	delWRExe(db, tn, r, cos) {
		return pr((v, j) => {
			const s = this.gOS(db, tn, M_RW),
				q = s.openCursor(r);
			q.onsuccess = (e) => {
				const c = e.target.result,
					l = [];
				if (c) {
					const v = c.value;
					if (IdbU.isMutch(v, cos)) {
						const o = s.delete(c.key);
						o.onsuccess = (e) => io(e, l.push(v));
						o.onerror = (e) => ef(e);
					}
					c.continue();
				} else v(l);
			};
			q.onerror = (e) => ef(e, j);
		});
	}
	async del(p) {
		return await this.delOT(await this.oDB().catch(tE(`del->oDB tn:${p.tn}`)), p.tn, p.key);
	}
	delOT(db, tn, k) {
		return pr((v, j) => oR(this.gOS(db, tn, M_RW).delete(`${k}`), v, j, { tn, key: k }));
	}
	async truncate(p) {
		return await this.truncExc(await this.oDB().catch(tE(`trunc->oDB tn:${p.tn}`)), p.tn);
	}
	truncExc(db, tn) {
		return pr((v, j) => oR(this.gOS(db, tn, M_RW).clear(), v, j));
	}
	async getOBN() {
		// console.log('getOBN :');
		const db = await this.oDB().catch(tE('getOBN->oDB'));
		// console.log('getOBN :' + db.objectStoreNames, db);
		return this.cDB(db.objectStoreNames);
	}
	async isExOb(tn) {
		const obss = await this.getOBN();
		// console.log('isExOb obss:', obss);
		return obss ? IdbU.includes(obss, tn) : 0;
	}
	static mkI = (tn, kp) => `${tn}-${kp}`;
	async cIdx(tn, kp, isME) {
		// console.log('cIdx tn:' + tn);
		const z = this,
			db = await z.oDB().catch(tE('creatIdx->oDB')),
			o = z.gOS(db, tn, M_RW);
		o.createIndex(IC.mkI(tn, kp), kp, { multiEntry: !!isME });
		return z.cDB(db.objectStoreNames);
	}
	async gIdxN(tn) {
		// console.log('gIdxN tn:' + tn);
		return this.cDB(this.gOS(await this.oDB().catch(tE('getIdxN->oDB')), tn, M_RW).indexNames);
	}
	async dIdx(tn, kp) {
		// console.log('dIdx tn:' + tn);
		this.cDB(await this.di(await this.oDB().catch(tE(`delIndex->oDB tn:${tn}`)), tn, kp));
	}
	di(db, tn, kp) {
		const z = this,
			o = z.gOS(db, tn, M_RW);
		return o.indexNames.includes(IC.mkI(tn, kp)) ? o.deleteIndex(z.mkI(tn, kp)) : N;
	}
	async cs(p) {
		if (!(await this.isExOb(p.tn))) {
			// console.log('cs tn:' + p.tn);
			const z = this,
				v = await z.getV(),
				// X = console.log('cs v:' + v),
				db = await z.oDB(v + 1).catch(tE(`cs->oDB tn:${p.tn}/isAI:${p.isAI}`)),
				// Y = console.log('cs db:' + db),
				n = db.objectStoreNames;
			// console.log('cs v:' + v + '/p.kpn :' + p.kpn, n);
			if (!IdbU.includes(n, p.tn)) db.createObjectStore(p.tn, { keyPath: p.kpn });
			z.cDB();
		}
	}
	async ds(tn) {
		// console.log('ds tn:' + tn);
		this.cDB((await this.oDB((await this.getV()) + 1).catch(tE(`ds->oDB tn:${tn}`))).deleteObjectStore(tn));
	}
}
const co = IC.gI(idbw.sysDBN);
class IOM {
	static c = new Map(); //on memory db
	static i = new Map(); //on memory db
	constructor(d) {
		const z = this;
		z.dbn = d;
		z.c = new Map();
		z.tns = [];
		z.lUDM = new Map();
		IOM.i.set(d, z);
	}
	static async gi(d) {
		let i = IOM.c.get(d);
		if (i) return i;
		i = new IOM(d);
		await i.i();
		IOM.c.set(d, i);
		return i;
	}
	async i() {
		// console.log('IOM i  idbw.CDBNa,:' + idbw.CDBNa);
		await co.cs({ tn: idbw.CDBNa, kpn: idbw.kpnA, isAI: false });
	}
	static ccWithObU(z, tn) {
		const tc = z.c.get(tn);
		for (const i in tc) delete tc[i];
		// console.log('ccWithObU tn:', tn);
		return IOM.regiCUT(z, tn);
	}
	static async regiCUT(z, tn, n = N) {
		z.lUDM[tn] = n;
		const utd = { upT: n };
		// console.log('regiCUT utd:', utd);
		utd[idbw.kpnA] = Js([z.dbn, tn]);
		co.IU(idbw.CDBNa, idbw.kpnA, utd);
		return N;
	}
	cc() {
		for (const n of this.tns) {
			const c = this.c.get(n);
			for (const i in c) delete c[i];
			this.c.delete(n);
		}
	}
	static async setC(z, tn, k, v) {
		if (!v || !v.data) return;
		const d = v.data;
		for (const i in d) if (d[i] && d[i].byteLength) return;
		const r = await co.sByK({ tn: idbw.CDBNa, key: Js([this.dbn, tn]) });
		// console.log('setC r:', r);
		if (r && r.upT !== z.lUDM[tn]) return IOM.ccWithObU(z, tn);
		else if (r && !z.lUDM[tn] && r.upT) IOM.regiCUT(z, tn, r.upT);
		else if (r && !r.upT) IOM.regiCUT(z, tn);
		let t = z.c.get(tn);
		if (!t) {
			t = {};
			z.tns.push(tn);
			z.c.set(tn, t);
		}
		t[k] = v;
	}
	async getC(tn, k) {
		const r = await co.sByK({ tn: idbw.CDBNa, key: Js([this.dbn, tn]) });
		if (r && r.upT !== this.lUDM[tn]) return IOM.ccWithObU(this, tn);
		const t = this.c.get(tn);
		return t ? t[k] : N;
	}
	uC(tn, k, d) {
		IOM.setC(this, tn, k, d);
	}
	trancC(tn) {
		IOM.ccWithObU(this, tn);
	}
	rmC(tn, key) {
		const tC = this.c.get(tn);
		if (tC) tC.delete(key);
	}
	maintainCache() {}
}
class IdbU {
	static isMutch(v, cos) {
		if (cos === void 0 || cos === N) return 0;
		if (isArr(cos)) {
			for (const c of cos) if (IdbU.isMutch(v, c)) return 1;
			return 0;
		} else {
			for (const k in cos) {
				const c = cos[k];
				if (typeof c === 'object' && IdbU.isMutch(v, c)) return 1;
				else if (v[k] !== c) return 0;
			}
			return 1;
		}
	}
	static mkKR = (s, e, isNotEqS = false, isNotEqE = false) => IDBKeyRange.bound(s, e, isNotEqS, isNotEqE);
	static mkKRUpper = (s, isNotEqS = false) => IDBKeyRange.upperBound(s, isNotEqS);
	static mkKRLower = (e, isNotEqE = false) => IDBKeyRange.lowerBound(e, isNotEqE);
	static mkKROnly = (only) => IDBKeyRange.only(only);
	//IDを生成
	static buildKeyPath(...ks) {
		const a = [];
		for (const k of ks) if (k !== void 0) a.push(`${k}`.split('&').join('&amp;').split('.').join('&#046;'));
		return a.join('');
	}
	static includes = (l, v) => {
		if (!l) return false;
		for (let i = 0; i < l.length; i++) if (l[i] === v) return true;
		return false;
	};
}
