import { useSelector } from "react-redux";
import Comic from "../Comic/Comic";

import { RootState } from "../../redux/store";
import { category } from "../../util/category";
import ResultDetail from "../Result/ResultDetail";
import { fakedatadetail } from "../../FakeData/FakedataDetail";

const Home = () => {
  const selectedCategory = useSelector(
    (state: RootState) => state.category.selectedCategory
  );

  const key: string =
    category.find((e) => e.name == selectedCategory)?.name || "";

  const HomePage = () => {
    return (
      <>
        <div className="text-black flex w-full gap-3 h-full flex-col ">
          <div className="w-full flex-col flex gap-2">
            <Comic />
 
          </div>
        </div>
      </>
    );
  };

  return (
    <div>
      {key == category[0].name ? (
        HomePage()
      ) : (
        <ResultDetail data={fakedatadetail} />
      )}
    </div>
  );
};

export default Home;
