import { render, axe } from "@/test-utils";
import { About } from "@/components/About";

const setup = () => render(<About />);

test("renders successfuly", () => {
  const { container } = setup();
  expect(container).toMatchSnapshot();
});

test("accessibility", async () => {
  const { container } = setup();
  expect(await axe(container)).toHaveNoViolations();
});
