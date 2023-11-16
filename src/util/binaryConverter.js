const N = '',
	te = new TextEncoder('utf-8'),
	td = new TextDecoder('utf-8'),
	J = JSON,
	Jp = (a) => J.parse(a),
	Js = (a) => J.stringify(a),
	gBl = (b) => (b.buffer ? b.buffer.byteLength : b.byteLength),
	cy = crypto.subtle,
	wi = window;
export class H {
	static async d(m, sc = 1, algo = 'SHA-256', isAB = false) {
		let r = m.buffer ? (m instanceof Uint8Array ? BinaryCnvtr.dpU(m) : B.u8(m.buffer)) : te.encode(m);
		for (let i = 0; i < sc; i++) r = await cy.digest(algo, r);
		return isAB ? r : BinaryCnvtr.a2U(r);
	}
	static async hmac(secretU, msgU, algo = 'SHA-512') {
		const key = await cy.importKey(
			'raw',
			secretU,
			{
				name: 'HMAC',
				hash: { name: algo },
			},
			false,
			['sign', 'verify']
		);
		return await cy.sign('HMAC', key, msgU);
	}
}
export class B {
	static u8 = (a) => new Uint8Array(a);
	static u32 = (a) => new Uint32Array(a);
	static i32 = (a) => new Int32Array(a);
}
export class BinaryCnvtr {
	static b2a = (binaryString) => BinaryCnvtr.b2u(binaryString).buffer;
	static a2b = (ab) => BinaryCnvtr.u2b(new Uint8Array(ab));
	static a2D = (ab, type = 'application/octet-stream') => 'data:' + type + ';base64,' + btoa(BinaryCnvtr.a2b(ab));
	static b2D = (binaryString, type = 'application/octet-stream') => 'data:' + type + ';base64,' + btoa(binaryString);
	static B2D = (base64, type = 'application/octet-stream') => 'data:' + type + ';base64,' + base64;
	static B2b = (base64) => atob(base64);
	static B2a = (base64) => BinaryCnvtr.b2a(atob(base64));
	static B2u = (base64) => BinaryCnvtr.u8(BinaryCnvtr.b2a(atob(base64)));
	static D2b = (dataURI) => atob(dataURI.split(',')[1]);
	static D2a = (dataURI) => BinaryCnvtr.b2u(atob(dataURI.split(',')[1])).buffer;
	static u2a = (u8a) => u8a.buffer;
	static u8 = (ab) => new Uint8Array(ab);
	static u16 = (ab) => new Uint16Array(ab);
	static u32 = (ab) => new Uint32Array(ab);
	static a2Bl = (val, type = 'application/octet-stream') => new Blob([val], { type: type });
	static isSameAb = (abA, abB) => BinaryCnvtr.a2B(abA) === BinaryCnvtr.a2B(abB);
	static isB64 = (s = N) => s % 4 === 0 && /[+/=0-9a-zA-Z]+/.test(s);
	static s2u = (s) => te.encode(s);
	static u2s = (u) => td.decode(u);
	static a2s = (a) => td.decode(B.u8(a));
	static a2B = (i) => wi.btoa(BinaryCnvtr.u2b(B.u8(i.buffer ? i.buffer : i)));
	static u2B = (u) => wi.bta(BinaryCnvtr.u2b(u));
	static u2I(u) {
		const f = B.u8(4),
			l = u.length,
			n = Mc(l / 4),
			i32a = B.i32(n);
		for (let i = 0; i < n; i++) {
			f[0] = u[i + 0];
			f[1] = l < i + 1 ? 0 : u[i + 1];
			f[2] = l < i + 2 ? 0 : u[i + 2];
			f[3] = l < i + 3 ? 0 : u[i + 3];
			i32a[i] = B.i32(f.buffer)[0];
		}
		return i32a;
	}
	static u8a2u32a(u) {
		const f = B.u8(4),
			l = u.length,
			n = Mc(l / 4),
			u32a = B.u32(n);
		for (let i = 0; i < n; i++) {
			f[0] = u[i + 0];
			f[1] = l < i + 1 ? 0 : u[i + 1];
			f[2] = l < i + 2 ? 0 : u[i + 2];
			f[3] = l < i + 3 ? 0 : u[i + 3];
			u32a[i] = B.u32(f.buffer)[0];
		}
		return u32a;
	}
	static h2u(h) {
		const l = h.length / 2,
			u = B.u8(l);
		for (let i = 0; i < l; i++) u[i] = parseInt(h.substr(i * 2, 2), 16);
		return u;
	}
	static u2h = (u) => Array.prototype.map.call(u, (x) => x.toString(16).padStart(2, '0')).join(N);
	static s2U = (s) => BinaryCnvtr.B2U(BinaryCnvtr.a2B(BinaryCnvtr.s2u(s).buffer));
	static a2U = (a) => BinaryCnvtr.B2U(BinaryCnvtr.a2B(a));
	static B2a = (B) => BinaryCnvtr.b2u(wi.atob(B));
	static U2a = (U) => BinaryCnvtr.B2a(BinaryCnvtr.U2B(U));
	static U2s = (U) => BinaryCnvtr.u2s(B.u8(BinaryCnvtr.B2a(BinaryCnvtr.U2B(U))));
	static B2U = (B) => (B ? B.split('+').join('-').split('/').join('_').split('=').join(N) : B);
	static U2B(U) {
		const l = U.length,
			c = l % 4 > 0 ? 4 - (l % 4) : 0;
		let B = U.split('-').join('+').split('_').join('/');
		for (let i = 0; i < c; i++) B += '=';
		return B;
	}
	static jus(s) {
		let l = 0;
		const c = s.length;
		for (let i = 0; i < c; i++) l += gBl(s[i]);
		const a = B.u8(l);
		let o = 0;
		for (let i = 0; i < c; i++) {
			const u = s[i];
			a.set(u, o);
			o += gBl(u);
		}
		return a;
	}
	static u2b(u) {
		const r = [];
		for (const e of u) r.push(String.fromCharCode(e));
		return r.join(N);
	}
	static b2u(bs) {
		const l = bs.length,
			a = B.u8(new ArrayBuffer(l));
		for (let i = 0; i < l; i++) a[i] = bs.charCodeAt(i);
		return a;
	}
	static L2a(b) {
		return pr((r) => {
			const fr = new FileReader();
			fr.onload = () => r(fr.result);
			fr.onerror = () => cb(r(fr.error), err(fr.error));
			fr.readAsArrayBuffer(b);
		});
	}
	static dpU(u) {
		const l = u.length,
			n = B.u8(l);
		for (let i = 0; i < l; i++) n[i] = u[i];
		return n;
	}
	static N2u(n) {
		let a = n;
		const p = [];
		while (Ma(a) > 0) {
			p.unshift(a % 256);
			a = a >> 8;
		}
		const l = p.length,
			u = B.u8(l);
		for (let i = 0; i < l; i++) u[i] = p[i];
		return u;
	}
	static b32a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'.split(N);
	static b32t = (() => {
		const t = {};
		for (let i = 0; i < 32; i++) t[BinaryCnvtr.b32a[i]] = i;
		return t;
	})();
	static b32d(b32) {
		const a = b32.toUpperCase().replace(/[^A-Z234567]/g, N),
			b = a.padEnd(Mc(a.length / 8) * 8, 'A'),
			u = B.u8((a.length * 5) / 8);
		let i = 0,
			j = 0,
			k = 0;
		for (const v of b.split(N)) {
			i = (i << 5) | BinaryCnvtr.b32t[v];
			j += 5;
			if (j >= 8) {
				j -= 8;
				u[k++] = i >> j;
				i %= 256;
			}
		}
		if (i > 0) u[k] = i;
		/*
        aaaaabbb
        bbcccccd
        ddddeeee
        efffffgg
        ggghhhhh
         */
		return u.buffer;
	}
	static b32e(ab) {
		const u = B.u8(ab),
			a = [];
		let j = 0,
			k = 0;
		for (let i = 0; i < u.length; i++) {
			const b = u[i];
			j = (j << 8) + b;
			k += 8;
			while (k > 5) {
				k -= 5;
				a.push(BinaryCnvtr.b32a[j >> k]);
				j &= (1 << k) - 1;
			}
		}
		if (k > 0) a.push(BinaryCnvtr.b32a[j << (5 - k)]);
		/*
        aaaaabbb
        bbcccccd
        ddddeeee
        efffffgg
        ggghhhhh
         */
		return a.join(N);
	}
	static readBlob(blob) {
		const reader = new FileReader();
		const promise = new Promise((resolve, reject) => {
			reader.onload = (eve) => {
				resolve(reader.result);
			};
			reader.onerror = (eve) => {
				reject(reader.error);
			};
		});
		return {
			asArrayBuffer() {
				reader.readAsArrayBuffer(blob);
				return promise;
				base642DataURI;
			},
			asBinaryString() {
				reader.readAsBinaryString(blob);
				return promise;
			},
			asDataURL() {
				reader.readAsDataURL(blob);
				return promise;
			},
			asText() {
				reader.readAsText(blob);
				return promise;
			},
		};
	}
}
export class Cy {
	static async gK(p, s) {
		const k = await cy.deriveKey(
			{
				name: 'PBKDF2',
				salt: s,
				iterations: 100000,
				hash: 'SHA-256',
			},
			await cy.importKey('raw', await H.d(Y.s2u(p).buffer, 100, 'SHA-256', true), { name: 'PBKDF2' }, false, [
				'deriveKey',
			]),
			{ name: 'AES-GCM', length: 256 },
			false,
			['encrypt', 'decrypt']
		);
		return [k, s];
	}
	static gS = (saltI, isAB) => (saltI ? (isAB ? B.u8(saltI) : Y.s2u(saltI)) : crv(B.u8(16)));
	static importKeyAESGCM = async (kAb, usages = ['encrypt', 'decrypt']) =>
		await cy.importKey('raw', kAb, { name: 'AES-GCM' }, true, usages);
	static gFF = () => crv(B.u8(12));
	static gIF = () => crv(B.u32(1));
	static srand = () => crv(B.u32(1))[0] / 4294967295;
	static enc = async (s, pk) => await Cy.encAES256GCM(Y.s2u(s), pk ? pk : await Cy.mkH());
	static async encAES256GCM(u, pk, saltI = null, isAB) {
		const s = Cy.gS(saltI, isAB),
			iv = Uint8Array.from([...Cy.gFF(), ...B.u8(Cy.gIF().buffer)]),
			edAb = await cy.encrypt({ name: 'AES-GCM', iv }, await Cy.lk(pk, s), u.buffer);
		return [Y.a2U(edAb), Y.a2U(iv.buffer), Y.a2U(s.buffer)].join(',');
	}
	static mkH = (s = [location.origin], st = 100) => H.d(Js(s), st);
	static dec = async (ers, pk) => Y.u2s(await Cy.decAES256GCM(ers, pk ? pk : await Cy.mkH()));
	static lk = async (pk, s) => (isS(pk) ? await Cy.gK(pk, isS(s) ? B.u8(Y.U2a(s)) : s) : [pk])[0];
	static async decAES256GCM(ers, p) {
		const [U, ip, s] = ers.split(',');
		try {
			return B.u8(await cy.decrypt({ name: 'AES-GCM', iv: B.u8(Y.U2a(ip)) }, await Cy.lk(p, s), Y.U2a(U)));
		} catch (e) {
			return ef(e);
		}
	}
}
