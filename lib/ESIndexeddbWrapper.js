const M_R = 'readonly';
const M_RW = 'readwrite';
const cSAll = 'cmdSelectAll';
const cSByKey = 'cmdSelectByKey';
const cSByKeys = 'cmdSelectByKeys';
const cSF1 = 'cmdSelectFirstOne';
const cBulkIU = 'cmdBulkInsertUpdate';
const cIU = 'cmdInsertUpdate';
const cDelWithRng = 'cmdDeleteWithRange';
const cDel = 'cmdDelete';
const cTrunc = 'cmdTruncate';
const cCreateOB = 'cmdCreateStore';
const cDelOB = 'cmdDeleteStore';
const cCreateIdx = 'cmdCreateIndex';
const cDelIdx = 'cmdDeleteIndex';
const cGetOBN = 'cmdGetObjectStoreNames';
const N = null;
const PFX = '_';
const Js = (a) => JSON.stringify(a);
const w = (...a) => console.warn(a);
const io = (...a) => console.info(a);
const err = (...a) => console.error(a);
const pr = (f) => new Promise(f);
const now = () => Date.now();
const isArr = (a) => Array.isArray(a);
const ct = (t) => clearTimeout(t);
const st = (f, w = 0) => setTimeout(f, w);
const ef = (e, j = () => {}, id = '', l = N) => {
	w(`${id} ${e.message}`);
	w(e.stack);
	if (l && l.log && l !== console) {
		l.log(`${id} ${e.message}`);
		l.log(e.stack);
	}
	j(e);
};
const oR = (r, v, j, rslt) => {
	r.onsuccess = (e) => v(!io(e) && rslt ? rslt : r.result);
	r.onerror = (e) => ef(e, j);
};
const gD = (d) => (d === N || d === undefined ? N : d.data);
const cb = async () => {};
function tE(m, j = cb) {
	return (e) => {
		ef(e, j);
		err(m ? m : `/${e}`);
		throw new Error(e);
	};
}
const mkR = (d, kpn, k) => {
	const r = {
		data: d,
	};
	r[kpn] = k;
	return r;
};
const ua = navigator.userAgent.replace(/[.0-9]+/g, 'x');
const kpn = 'pk';
const cnst = {
	sysDbName: 'IDBWrapperSys',
	cacheObName: 'cacheTimes',
	dbName: 'IDBWrapper',
	ua,
	domain: window.location,
	kpn,
};
const sysDBN = cnst.sysDbName;
const CDBNa = cnst.cacheObName;
const kpnA = cnst.kpn;
const co = new IC(sysDBN);
const crrntDBN = cnst.dbName;
export class idbw {
	constructor(d = crrntDBN) {
		this.dbn = d;
	}
	async getAccessor(tn = crrntDBN, kpn = kpnA) {
		return await IA.gi(tn, kpn, this.dbn);
	}
}
class IA {
	#i = N;
	static hM = new Map();
	static aM = new Map();
	static dbName = cnst.dbName;
	static SBBA = N;
	constructor(tn, kpn = cnst.kpn, isAI = 0, cObN = IA.dbName, l = console) {
		const z = this;
		if (!IA.hM.has(cObN)) {
			z.#i = new IH(cObN);
			IA.hM.set(cObN, z.#i);
		} else {
			z.#i = IA.hM.get(cObN);
		}
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
		if (!IA.SBBA) IA.SBBA = await IA.mki(CDBNa, kpn, 0, sysDBN, 0);
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
		this.dbn = d;
		this.co = new IC(d);
		this.q = [];
		this.lltMode = N;
		this.lastLockTime = now();
		this.c = 0;
		this.isWC = 1;
	}
	async i() {
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
				if (z.c < 1 && z.q.length > 0) z.dQ();
			}
		}
	}
	dQE() {
		return pr(async (v) => {
			const z = this;
			const q = z.q; //queue
			while (q.length > 0) {
				const p = []; //process
				const st = [];
				while (q.length > 0) {
					const t = q.shift();
					if (!t) continue;
					if (z.lltMode !== t.mode || t.mode === M_RW) {
						if (p.length > 0) {
							const r = await Promise.all(p).catch(ef); //RW
							for (const i in r) st[i].rv(r[i]);
							p.splice(0, p.length);
						}
						await z.excUpT(t, v);
					} else {
						const p = z.eC(t.cmd, t.data); //R
						p.push(p);
						st.push(t);
					}
					z.lltMode = t.mode;
				}
				if (p.length > 0) {
					const r = await Promise.all(p).catch(ef);
					for (const i in r) st[i].rv(r[i]);
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
	eQR(c, d) {
		return this.eQ(c, d, M_R);
	}
	eQW(c, d) {
		return this.eQ(c, d, M_RW);
	}
	eQ(c, d, m) {
		return pr((rv, rj) => cb(this.q.push({ cmd: c, data: d, rv, rj, mode: m }), this.dQ())); //enQueue
	}
	async gC(tn, m, d, cbf = cb, isC) {
		if (!isC) return await cbf();
		const k = Js([m, d]);
		const c = await this.CM.getC(tn, k);
		if (c) return c;
		const r = await cbf();
		this.CM.uC(tn, k, r);
		return r;
	}
	cc(tn, isC) {
		return isC ? this.CM.trancC(tn) : N;
	}
	eC(c, d) {
		const z = this;
		const o = z.co;
		const tn = d.tn;
		const rng = d.rng;
		const kpn = d.kpn;
		const drct = d.drct;
		const cons = d.cons;
		const keys = d.keys;
		const key = d.key;
		const isC = d.isC;
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
		return this.eQR(cSAll, {
			tn, //selectall
			rng,
			drct,
			ofst,
			lc,
			isC,
		});
	}
	sByKey(tn, k, isC = 1) {
		return this.eQR(cSByKey, { tn, key: k, isC });
	}
	sByKeys(tn, ks, isC = 1) {
		return this.eQR(cSByKeys, { tn, keys: ks, isC });
	}
	sF1(tn, r, drct, isC = 1) {
		return this.eQR(cSF1, { tn, rng: r, drct, isC });
	}
	bulkIU(tn, kpn, d, cb, isC = 1) {
		return this.eQW(cBulkIU, {
			tn,
			kpn,
			data: d,
			cb,
			isC,
		});
	}
	iu(tn, kpn, d, cb, isC = 1) {
		return this.eQW(cIU, { tn, kpn, data: d, cb, isC });
	}
	delWithRange(tn, r, drct, isC = 1) {
		return this.eQW(cDelWithRng, { tn, rng: r, drct, isC });
	}
	del(tn, kpn, isC = 1) {
		return this.eQW(cDel, { tn, kpv: kpn, isC });
	}
	truncate(tn, isC = 1) {
		return this.eQW(cTrunc, { tn, isC });
	}
	cOS(tn, kpn, isAI, isC = 1) {
		return this.eQW(cCreateOB, { tn, kpn, isAI, isC });
	}
	delOB(tn, isC = 1) {
		return this.eQW(cDelOB, { tn, isC });
	}
	creatIdx(tn, kpn, isMultiColumns) {
		return this.eQW(cCreateIdx, { tn, kpn, isMultiColumns });
	}
	delIdx(tn, idxN) {
		return this.eQW(cDelIdx, { tn, idxN });
	}
	getOBNs() {
		return this.eQR(cGetOBN, {});
	}
}
class IOM {
	static c = new Map(); //on memory db
	constructor(d) {
		this.dbn = d;
		this.c = new Map();
		this.tns = [];
		this.lUDM = new Map();
	}
	static async gi(d) {
		let i = IOM.c.get(d);
		if (i) return i;
		i = new IOM(d);
		await i.init();
		IOM.c.set(d, i);
		return i;
	}
	async i() {
		await co.cs({ tn: CDBNa, kpn: kpnA, isAI: false });
	}
	ccWithObU(tn) {
		const tc = this.c.get(tn);
		for (const i in tc) delete tc[i];
		return this.regiCUT(tn);
	}
	async regiCUT(tn, n = n()) {
		this.lUDM[tn] = n;
		const utd = { upT: n };
		utd[kpnA] = Js([this.dbn, tn]);
		co.IU(CDBNa, kpnA, utd);
		return N;
	}
	cc() {
		for (const n of this.tns) {
			const c = this.c.get(n);
			for (const i in c) delete c[i];
			this.c.delete(n);
		}
	}
	async setC(tn, k, v) {
		const z = this;
		if (!v || !v.data) return;
		const d = v.data;
		for (const i in d) if (d[i] && d[i].byteLength) return;
		const r = await co.sByK({ tn: CDBNa, key: Js([this.dbn, tn]) });
		if (r && r.upT !== z.lUDM[tn]) return z.ccWithObU(tn);
		else if (!z.lUDM[tn] && r.upT) z.regiCUT(tn, r.upT);
		else if (!r.upT) z.regiCUT(tn);
		let t = z.c.get(tn);
		if (!t) {
			t = {};
			z.tns.push(tn);
			z.c.set(tn, t);
		}
		t[k] = v;
	}
	async getC(tn, k) {
		const r = await co.sByK({ tn: CDBNa, key: Js([this.dbn, tn]) });
		if (r && r.upT !== this.lUDM[tn]) return this.ccWithObU(tn);
		const t = this.c.get(tn);
		return t ? t[k] : N;
	}
	uC(tn, k, d) {
		this.setC(tn, k, d);
	}
	trancC(tn) {
		this.ccWithObU(tn);
	}
	rmC(tn, key) {
		const tC = this.c.get(tn);
		if (tC) tC.delete(key);
	}
	maintainCache() {}
}
class IC {
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
	}
	oDB(nv) {
		return pr((v, j) => {
			const z = this;
			z.lastVer = nv;
			if (z.lastVer && z.db) {
				z.db.close();
				z.isRWO = 1;
			} else if (z.db && z.isDBC === 0) return v(z.db);
			else z.isRWO = z.lastVer ? 1 : 0;
			const f = (e) => {
				z.db = e.target.result;
				z.isDBC = 0;
				v(z.db);
			};
			const r = z.idb.open(z.dbn, nv);
			r.onsuccess = f;
			r.onupgradeneeded = f;
			r.onabort = (e) => ef(e, v);
			r.onerror = (e) => ef(e, j);
		});
	}
	cDB(v) {
		if (this.isRWO) return this.beCDB(v);
		ct(this.t);
		this.t = st(() => this.beCDB(), 1000);
		return v;
	}
	beCDB(v) {
		this.db.close();
		this.isDBC = 1;
		return v;
	}
	gOS(db, tn, m, ts) {
		const t = db.transaction(isArr(ts) ? ts : [tn], m);
		const f = (e) => this.cDB(io(e));
		t.oncomplete = f;
		t.onerror = f;
		return t.objectStore(tn); //getObjectStore
	}
	getKPbyM(tn) {
		return this.kpM[tn];
	}
	async getKP(tn) {
		const kpn = this.getKPbyM(tn);
		if (kpn) return kpn;
		const os = this.gOS(await this.oDB().catch(tE('getKP->oDB')), tn, M_R, [tn]);
		const k = os.keyPath;
		this.kpM[tn] = k;
		return this.cDB(k);
	}
	async getV() {
		return this.cDB(await this.oDB().catch(tE('getV->oDB')).version);
	}
	async sAll(p, cbc = cb) {
		const ob = this.gOS(await this.oDB().catch(tE(`sAll->oDB tn:${p.tn}`)), p.tn, [p.tn], M_R);
		return await this.sAllE(ob, p.rng, 0, p.ofst, p.cnt, cbc);
	}
	sAllE(ob, d, isGetF1, ofst, cnt, cb) {
		return pr((v, j) => {
			const isValidCB = typeof ofst === 'function';
			const isOnLimit = typeof ofst === 'number' && typeof cnt === 'number' && ofst > 0 && cnt > 0;
			const endC = isValidCB ? cnt : ofst + cnt;
			const l = [];
			let rC = 0;
			const r = ob.openCursor(d ? d : undefined);
			r.onsuccess = (e) => {
				const c = e.target.result;
				if (c) {
					const v = c.value;
					if (isValidCB && !cb(v)) return c.continue();
					if (isOnLimit)
						if (ofst > rC) return c.continue(undefined, rC++);
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
		return this.getR(this.gOS(db, tn, m, [tn]), k);
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
		return this.sByKsoTE(this.gOS(db, tn, M_R, [tn]), ks, tn);
	}
	async sByKsoTE(os, ks) {
		const m = {};
		for (const k of ks) m[k] = await this.getR(os, k);
		return m;
	}
	async sF1(p) {
		return await this.sAllE(
			this.gOS(await this.oDB().catch(tE(`sF1->oDB tn:${p.tn}/drct:${p.drct}`)), p.tn, M_R, [p.tn]),
			p.rng,
			true
		);
	}
	async bulkIU(tn, kpn, d, cbc = cb) {
		const dl = [];
		const ks = [];
		for (const r of d) {
			const k = r[kpn];
			cb(dl.push({ k, r }), ks.push(k));
		}
		const o = this.gOS(await this.oDB().catch(tE(`bulkIU->oDB tn:${tn}`)), tn, M_RW);
		const dM = await this.sByKsoTE(o, ks, tn);
		const p = [];
		const q = [];
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
		const k = d[kpn];
		const db = await this.oDB().catch(tE(`IU->oDB tn:${tn}`));
		const v = await this.sByKoT(db, tn, k, M_RW).catch(tE(`IU->sByKoT tn:${tn}/MODE_RW`));
		cbc(v, d);
		return await (v === undefined
			? this.add(this.gOS(db, tn, M_RW), k, d)
			: this.put(this.gOS(db, tn, M_RW), k, d)
		).catch(tE(`IU->add/put tn:${tn}`));
	}
	async delWithRng(p) {
		return await this.delWRExe(await this.oDB().catch(tE(`delWithRng->oDB tn:${p.tn}`)), p.tn, p.rng, p.cos);
	}
	delWRExe(db, tn, r, cos) {
		return pr((v, j) => {
			const s = this.gOS(db, tn, M_RW);
			const q = s.openCursor(r);
			q.onsuccess = (e) => {
				const c = e.target.result;
				const l = [];
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
		return this.cDB(await this.oDB().catch(tE('getOBN->oDB')).objectStoreNames);
	}
	async isExOb(tn) {
		return (await this.getOBN()).includes(tn);
	}
	mkI(tn, kp) {
		return `${tn}-${kp}`;
	}
	async cIdx(tn, kp, isME) {
		const db = await this.oDB().catch(tE('creatIdx->oDB'));
		const o = this.gOS(db, tn, M_RW);
		o.createIndex(this.mkI(tn, kp), kp, { multiEntry: !!isME });
		return this.cDB(db.objectStoreNames);
	}
	async gIdxN(tn) {
		return this.cDB(this.gOS(await this.oDB().catch(tE('getIdxN->oDB')), tn, M_RW).indexNames);
	}
	async dIdx(tn, kp) {
		this.cDB(await this.di(await this.oDB().catch(tE(`delIndex->oDB tn:${tn}`)), tn, kp));
	}
	di(db, tn, kp) {
		const o = this.gOS(db, tn, M_RW);
		return o.indexNames.includes(this.mkI(tn, kp)) ? o.deleteIndex(this.mkI(tn, kp)) : N;
	}
	async cs(p) {
		if (!(await this.isExOb(p.tn))) {
			const db = await this.oDB((await this.getV()) + 1).catch(tE(`cs->oDB tn:${p.tn}/isAI:${p.isAI}`));
			if (!db.objectStoreName.includes(p.tn)) db.createObjectStore(p.tn, { keyPath: p.pkn });
			this.cDB();
		}
	}
	async ds(tn) {
		this.cDB((await this.oDB((await this.getV()) + 1).catch(tE(`ds->oDB tn:${tn}`))).deleteObjectStore(tn));
	}
}
class IdbU {
	static isMutch(v, cos) {
		if (cos === undefined || cos === N) return 0;
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
	static mkKR(s, e, isNotEqS = false, isNotEqE = false) {
		return IDBKeyRange.bound(s, e, isNotEqS, isNotEqE);
	}
	static mkKRUpper(s, isNotEqS = false) {
		return IDBKeyRange.upperBound(s, isNotEqS);
	}
	static mkKRLower(e, isNotEqE = false) {
		return IDBKeyRange.lowerBound(e, isNotEqE);
	}
	static mkKROnly(only) {
		return IDBKeyRange.only(only);
	}
	//IDを生成
	static buildKeyPath(...ks) {
		const a = [];
		for (const k of ks) if (k !== undefined) a.push(`${k}`.split('&').join('&amp;').split('.').join('&#046;'));
		return a.join('');
	}
}
