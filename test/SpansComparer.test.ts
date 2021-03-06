import "mocha";
import { assert } from "chai";
import { KanjiList } from "../src/KanjiList";
import { MatchAlgorithm } from "../src/MatchAlgorithm";
import { KanjiVgLoaderTest } from "./KanjiVgLoader.test";

describe("SpansComparer.test", () => {

    /**
	 * Set this flag on to enable timing comparison by testing 100 characters
	 * instead of just 5. On my system this currently takes around 20.4 seconds.
	 */
    const DEBUG = false;

    it("testBigMatch", async () => {

        // This compares the first 5 20-stroke kanji characters against all the
        // others and checks that they match themselves. In addition to correctness
        // checking it can be used for timing comparison (increasing the limit may
        // give more stable results).
        const list = new KanjiList();
        const readAll = await KanjiVgLoaderTest.getAll();
        for (const kanjiInfo of readAll) {
            list.add(kanjiInfo);
        }
        list.finish();

        for (let strokeCount = 1; strokeCount <= 20; strokeCount++) {
            const all = list.getKanji(strokeCount);

            for (let i = 0; i < all.length && i < (DEBUG ? 100 : 5); i++) {
                const big = all[i];
                if (DEBUG) {
                    console.log(big.kanji);
                    if (i % 10 === 9) {
                        console.log();
                    }
                }
                const matches = list.getTopMatches(big, MatchAlgorithm.SPANS);
                assert.equal(big.kanji, matches[0].kanjiInfo.kanji);
            }

            if (DEBUG) {
                console.log();
            }
        }
    });

});
