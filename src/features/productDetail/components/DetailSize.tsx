import React from "react";
import styles from "./DetailSize.module.css";

const DetailSize: React.FC = () => {
  return (
    <div className={styles.detailSize}>
      <p className={styles.title}>사이즈 정보</p>
      <div className={styles.tab}>
        <table className={styles.sizeTable}>
          <thead>
            <tr className={styles.headerRow}>
              <th>JP</th>
              <th>220</th>
              <th>225</th>
              <th>230</th>
              <th>235</th>
              <th>240</th>
              <th>245</th>
              <th>250</th>
              <th>255</th>
              <th>260</th>
              <th>265</th>
              <th>270</th>
              <th>275</th>
              <th>280</th>
              <th>285</th>
              <th>290</th>
              <th>295</th>
              <th>300</th>
              <th>305</th>
              <th>310</th>
              <th>315</th>
              <th>320</th>
              <th>325</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.rowHeader}>KR</td>
              <td>220</td>
              <td>225</td>
              <td>230</td>
              <td>235</td>
              <td>240</td>
              <td>245</td>
              <td>250</td>
              <td>255</td>
              <td>260</td>
              <td>265</td>
              <td>270</td>
              <td>275</td>
              <td>280</td>
              <td>285</td>
              <td>290</td>
              <td>295</td>
              <td>300</td>
              <td>305</td>
              <td>310</td>
              <td>315</td>
              <td>320</td>
              <td>325</td>
            </tr>
            <tr>
              <td className={styles.rowHeader}>US (M)</td>
              <td>5</td>
              <td>5.5</td>
              <td>6</td>
              <td>6.5</td>
              <td>7</td>
              <td>7.5</td>
              <td>8</td>
              <td>8.5</td>
              <td>9</td>
              <td>9.5</td>
              <td>10</td>
              <td>10.5</td>
              <td>11</td>
              <td>11.5</td>
              <td>12</td>
              <td>12.5</td>
              <td>13</td>
              <td>13.5</td>
              <td>14</td>
              <td>14.5</td>
              <td>15</td>
              <td>15.5</td>
            </tr>
            <tr>
              <td className={styles.rowHeader}>US (W)</td>
              <td>4</td>
              <td>4.5</td>
              <td>5</td>
              <td>5.5</td>
              <td>6</td>
              <td>6.5</td>
              <td>7</td>
              <td>7.5</td>
              <td>8</td>
              <td>8.5</td>
              <td>9</td>
              <td>9.5</td>
              <td>10</td>
              <td>10.5</td>
              <td>11</td>
              <td>11.5</td>
              <td>12</td>
              <td>12.5</td>
              <td>13</td>
              <td>13.5</td>
              <td>14</td>
              <td>14.5</td>
            </tr>
            <tr>
              <td className={styles.rowHeader}>UK</td>
              <td>3.5</td>
              <td>4</td>
              <td>4.5</td>
              <td>5</td>
              <td>5.5</td>
              <td>6</td>
              <td>6.5</td>
              <td>7</td>
              <td>7.5</td>
              <td>8</td>
              <td>8.5</td>
              <td>9</td>
              <td>9.5</td>
              <td>10</td>
              <td>10.5</td>
              <td>11</td>
              <td>11.5</td>
              <td>12</td>
              <td>12.5</td>
              <td>13</td>
              <td>13.5</td>
              <td>14</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.disclaimer}>
        ・해당 사이즈 정보는 고객 이해를 위한 참고용이며, 정확한 내용은 브랜드
        공식 홈페이지에서 확인해 주시기 바랍니다.
      </div>
    </div>
  );
};

export default DetailSize;
